import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Config} from "./config";
import {NiceApi} from "./nice-api";
import {AuthData} from "./nice-api.interfaces";
import {Firebase} from "./firebase";
import {UserData} from "./firebase.interface";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

/**
 * 앱에서 로그인 또는 인증하기 버튼을 클릭하면 호출되는 함수.
 *
 * 먼저, 고정 IP 를 사용해야만 한다. 클라우드 함수는 기본적으로 동적 IP 를 사용한다.
 * 그래서 처음에는 잘 되나가 어느 순간 부터는 인증창이 안열리는 상황이 발생하므로 꼭 고정 IP 를 사용해야 한다.
 *
 * response.redirect() 를 하면 40% 확률 본인 인증 실패한다. (표준 인증창이 열리지 않는다.) 정확한
 * 이유는 모르겠지만, redirect 할 때 어떤 상황/시점/조건에 따라서 실패하는 것 같다. (정말 알 수 없는 일이다.)
 * FORM 을 만들고 전송을 하니, 100% 정상 동작한다. 실패가 단 한건도 없이, 표준 인증창을 잘 열 수 있었다.
 */
export const niceAuth = functions
// VPC Connector 를 사용해서 고정 IP 를 사용한다.
    .runWith({
      vpcConnector: "pass-connector",
      vpcConnectorEgressSettings: "ALL_TRAFFIC",
    })
// VPC 에 등록된 동일한 지역어야 한다.
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
    // 암호화  토큰 요청. (암호화 키 생성)
    // 이 때, accessToken 은 미리 환경변수로 설정해둔다. (50년간 키 사용 가능.)
      const auth = await NiceApi.requestCryptToken(Config.accessToken);

      // 암호화 토큰을 바탕으로 암호화 키 생성
      NiceApi.generateSymmetricKey(auth);
      // 생성한 암호화 키로, 데이터 암호화
      // 요청 번호, sitecode, return url, 개발자가 직접 정의하는 상태 코드, authtype 등을 암호화.
      const encrypted = NiceApi.encryptData(auth);
      // Hmac 무결성 검증을 위한 코등 생성
      const integrity_value = NiceApi.hmac256(encrypted, auth);

      // 암호화 정보를 Firestore 에 보관
      //
      // 안전하게, Security rule 자체를 적용하지 않으면 된다. Cloud function 은 rule 없이 참조 가능.
      // 문서를 token version id 를 키로 해서, 암호화(auth) 정보를 저장. 인증 후 -> 복호화 할 때 사용.
      auth.encrypted = encrypted;
      auth.integrity_value = integrity_value;
      await Firebase.niceApiCol()
          .doc(auth.crypto.dataBody.token_version_id)
          .set(auth);

      // 인증창을 띄우기 위해, FORM 을 만들고 전송한다. response.redirect() 는 안된다.
      response.send(`
<html>
<body>
<form name="form_chk" id="form_chk" method="get" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb">
    <input type="hidden" id="m" name="m" value="service" />
    <input type="hidden" id="token_version_id" name="token_version_id" value="${auth.crypto.dataBody.token_version_id}" />
    <input type="hidden" id="enc_data" name="enc_data" value="${encrypted}" />
    <input type="hidden" id="integrity_value" name="integrity_value" value="${integrity_value}" />
</form>
<script language='javascript'>
    window.addEventListener("load", (event) => {
      document.form_chk.submit();
    });
</script>
</body>
</html>
    `);
    });

/**
 * 나이스 API 표준 인증창에서 성공적으로 인증 후, (RETURN URL 에 의해) 호출되는 함수
 *
 * 나이스 API 가 사용자 정보를 암호화해서 보내주는데, 이를 복호화한다.
 *
 * 참고로, 암호화 할 때 저장해 놓은 auth 문서 (문서 키: integrity_value) 를 복호화 후 삭제해도 된다.
 * 하지만, 용량이 크지 않고 (사용자 인증 회 수가 많지 않고) Security rules 을 작성하지 않으면 안전하므로
 * 굳이 삭제하지 않는다. (물론 원한다면 삭제해도 된다.)
 *
 * 반드시 고정 IP 를 써야 한다.
 */
export const niceAuthCallback = functions
    .runWith({
      vpcConnector: "pass-connector",
      vpcConnectorEgressSettings: "ALL_TRAFFIC",
    })
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
    // 암호화 정보를 저장한 문서를 읽는다.
      const token_version_id = request.query.token_version_id as string;
      const doc = await Firebase.niceApiCol().doc(token_version_id).get();
      const auth = doc.data() as AuthData;

      // 복호화
      const decrypted = NiceApi.decryptData(
      request.query.enc_data as string,
      auth
      );
      const json = JSON.parse(decrypted);
      Config.trace("niceAuthCallback(); Decrypted data in json: ", json);

      // 사용자 정보
      const data = {
        display_name: "",
        name: decodeURIComponent(json.utf8_name),
        birthday: json.birthdate,
        phone_number: json.mobileno ?? "",
        gender: json.gender == "1" ? "M" : "F",
      } as UserData;

      // 사용자 정보를 바탕으로 회원 가입 or 로그인
      Config.trace("niceAuthCallback(); User create or login;", data);
      const user = await Firebase.createUser(data);

      // Custom token 생성
      const customToken = await admin.auth().createCustomToken(user.uid);

      // 앱/웹으로 Custom token 전달할 Dynamic Link
      // Dynamic Link 를 쉽게 만드려면, Firebase 에서 생성할 때, 임시 경로로 생성해서, 복사하여 수정한다.
      // Dynamic Link 에서 `PatchToken` 부분을 Custom token 으로 치환하므로, 링크에 적절이 포함되어 있어야 한다.
      const link = Config.dynamicLink.replace("PatchToken", customToken);

      Config.trace("Dynamic Link", link);

      // 인증 -> 복호화 -> 회원 가입 or 로그인 -> Custom token 생성 -> 앱/웹으로 Custom token 전달(URL redirect)
      response.redirect(link);
    });
