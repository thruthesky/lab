import NiceApiKey from "../keys/nice-api-key";
/**
 * Config
 *
 * 나이스 PASS 본인 확인 설정
 */
export class Config {
  // true 이면 debug console 메시를 출력한다. 테스트 할 때에만 true 로 한다.
  static debug = true;

  // local = true 이면, 로컬에서 테스트 할 때 사용한다.
  // 실제 배포를 할 때에는 반드시, false 로 해야 한다.
  static local = false;

  // 모든 나이스 PASS 본인 확인 앱을 개발 할 때, clientId 와 clientSecret 을 관리자 페이지에서 항상 가져와야 한다.
  // 나이스 관리자 화면 -> 앱 상세 보기 -> 키 조회
  static clientId = NiceApiKey.clientId;
  static clientSecret = NiceApiKey.clientSecret;

  // 기관(가맹사) 액세스 토큰. 50 년 동안 유효하다. 즉, 한번만 호출해서, 그 값을 재 사용하면 된다.
  static accessToken = NiceApiKey.accessToken;

  // 리턴 URL, 콜백 URL. 프로젝트 마다 적절히 수정해야 한다. 특히, domain(host) 부분.
  static returnUrl = Config.local ?
    "http://localhost:5001/hype-9f920/asia-northeast3/niceAuthCallback" :
    "https://asia-northeast3-hype-9f920.cloudfunctions.net/niceAuthCallback";

  // 앱을 열기 위한, Deep Link URL.
  // iOS 에서 prefix 가 들어가면 잘 동작하지 않는다. 이 부분 확인이 필요하다.
  // `PatchToken` 에 토큰이 들어간다.
  // 모든 것이 성공적으로 인증되면, 앱의 /afterNiceAuth route 로 접속을 한다.
  static androidUrl =
    "https://hypetalk.page.link/?link=https://hypetalk.page.link/afterNiceAuth/?token%3DPatchToken&apn=com.withcenter.hypetalk&isi=6446163804&ibi=com.withcenter.hypetalk&st=Auth+Callback&sd=Nice+Auth+Callback+URL&efr=1";
  static iosUrl =
    "https://hypetalk.page.link/?link=https://hypetalk.page.link/afterNiceAuth/?token%3DPatchToken&apn=com.withcenter.hypetalk&isi=6446163804&ibi=com.withcenter.hypetalk&st=Auth+Callback&sd=Nice+Auth+Callback+URL&efr=1";
  // "com.withcenter.hypetalk://hypetalk.page.link/niceAuthCallback/?token=";

  static webUrl = Config.local ?
    "http://localhost:53538/afterNiceAuth/?token=" :
    "https://hypetalk.flutterflow.app/afterNiceAuth/?token=";

  //
  // -- 아래는 경우에 따라서 수정해야 한다. --
  //

  // 사용자의 개인 정보가 저장되는 곳. 전화번호가 저장된다.
  // 만약, users 컬렉션에 모든 정보를 저장하고 싶으면,
  // userPublicDataCollectionName 을 userCollectionName 과 동일하기 하면된다.
  static userCollectionName = "users";

  // 사용자의 공개 정보가 저장되는 곳. 전화번호를 빼고 나머지 정보(이름, 생년월일, 성별)가 저장된다.
  static userPublicDataCollectionName = "users_public_data";

  //
  // -- 공통: 아래는 전혀 수정 할 필요 없다 --
  //

  // 모든 프로젝트에 동일. 업데이트 할 필요 없음.
  // 나이스 관리자 화면 -> 앱 상세 보기 -> 구성 상품 -> 상품 코드
  static productID = "2101979031";

  static apiUrl = "https://svc.niceapi.co.kr:22001";
  // access token 요청 uri
  static accessTokenRequestUri = "/digital/niceid/oauth/oauth/token";

  // 암호화 token 요청 uri
  static cryptoTokenRequestUri = "/digital/niceid/api/v1.0/common/crypto/token";

  /**
   * 디버그 메시지 출력
   *
   * Config.debug = true 로 하면, 메시지를 출력한다.
   *
   * @param message message
   * @param data data
   * @param extra extra
   *
   *
   */
  static trace(message: string, data: unknown, extra?: unknown) {
    if (Config.debug) {
      console.info("    ----> " + message, data, extra ?? "");
    }
  }
}
