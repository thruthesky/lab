import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Config} from "./config";
import {NiceApi} from "./nice-api";
import {AuthData} from "./nice-api.interfaces";
import {Firebase} from "./firebase";
import * as detect from "detect-browser";
import {UserData} from "./firebase.interface";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
export const niceAuth = functions
// VPC Connector 를 사용해서 고정 IP 를 사용한다.
    .runWith({
      vpcConnector: "pass-connector",
      vpcConnectorEgressSettings: "ALL_TRAFFIC",
    })
// VPC 에 등록된 동일한 지역어야 한다.
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
      const auth = await NiceApi.requestCryptToken(Config.accessToken);
      NiceApi.generateSymmetricKey(auth);
      const encrypted = NiceApi.encryptData(auth);
      const integrity_value = NiceApi.hmac256(encrypted, auth);
      // const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${auth.crypto.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;
      // response.redirect(url);

      // 주의: redirect() 하면 동작하지 않는다 (redirect 는 30% 확률로 실패한다). 반드시 FORM submit() 으로 해야 한다.

      auth.encrypted = encrypted;
      auth.integrity_value = integrity_value;
      // token version id 를 키로 해서, auth 정보를 저장한다. 인증 후, 복호화 할 때 사용.
      await Firebase.niceApiCol()
          .doc(auth.crypto.dataBody.token_version_id)
          .set(auth);
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
 * 인증 후, RETURN URL 에 의해 호출되는 콜백 함수
 *
 * 복호 후, integrity_value 문서를 삭제한다.
 */
export const niceAuthCallback = functions
    .runWith({
      vpcConnector: "pass-connector",
      vpcConnectorEgressSettings: "ALL_TRAFFIC",
    })
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
      const token_version_id = request.query.token_version_id as string;
      const doc = await Firebase.niceApiCol().doc(token_version_id).get();
      const auth = doc.data() as AuthData;
      // console.log("auth: ", auth);
      const decrypted = NiceApi.decryptData(
      request.query.enc_data as string,
      auth
      );
      const json = JSON.parse(decrypted);
      Config.trace("json: ", json);

      const data = {
        display_name: "",
        name: decodeURIComponent(json.utf8_name),
        birthday: json.birthdate,
        phone_number: json.mobileno ?? "",
        gender: json.gender == "1" ? "M" : "F",
      } as UserData;

      Config.trace("niceAuthCallback() -> descrypted data;", data);
      const user = await Firebase.createUser(data);

      const customToken = await admin.auth().createCustomToken(user.uid);

      Config.trace("user-agent", request.headers["user-agent"]);
      const os = detect.detectOS(request.headers["user-agent"] as string);

      Config.trace("os", os);

      let uri = Config.webUrl;
      if (os == "iOS") {
        uri = Config.iosUrl;
      } else if (os == "Android OS") {
        uri = Config.androidUrl;
      }
      const url = `${uri}${customToken}`;
      Config.trace("url", url);

      // 인증 & 복호화 & 회원 가입 or 로그인 후, 앱/웹으로 이동 할 때, URL redirect 한다.
      // 참고, 인증을 시작 할 때, 표준인증창 열 때는, redirect 를 하면 오류가 많이 난다.
      // 주의, In-App Browser 로 실행을 하면 동작하지 않는다. 반드시 iOS 에서 external browser 로 실행을 해야 한다.
      response.redirect(url);
    });
