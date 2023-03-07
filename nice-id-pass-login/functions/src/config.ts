/**
 * Config
 *
 * 나이스 PASS 본인 확인 설정
 */
export class Config {
  // 모든 나이스 PASS 본인 확인 앱을 개발 할 때, clientId 와 clientSecret 을 관리자 페이지에서 항상 가져와야 한다.
  // 나이스 관리자 화면 -> 앱 상세 보기 -> 키 조회
  static clientId = "b48a6fd7-19a2-4819-8c4d-cec0a7ccf552";
  static clientSecret = "4d9f792b5d5ed8ec7a9a203d803a75e8";

  // 기관(가맹사) 액세스 토큰. 50 년 동안 유효하다. 즉, 한번만 호출해서, 그 값을 재 사용하면 된다.
  static accessToken = "3655377d-f5e7-46e5-8361-7b3cded48626";

  // 리턴 URL, 콜백 URL. 프로젝트 마다 적절히 수정해야 한다. 특히, domain(host) 부분.
  // static returnUrl =
  //   "https://asia-northeast3-hype-9f920.cloudfunctions.net/niceAuthCallback";
  static returnUrl =
    "http://localhost:5001/hype-9f920/asia-northeast3/niceAuthCallback";

  // 앱을 열기 위한, Deep Link URL.
  // 원래는 동일한 Deep Link URL 이어야 하는데, 2023년 3월 8일 기준, FlutterFlow 에 버그가 있다.
  // Deep Link 가 훨씬 부드럽게 잘 동작하는데, 2023년 3월 8일 기준, iOS 는 땜빵으로 동자하지만, Android 는 동작하지 않는다.
  // 그래서 Android 는 Dyanmic Link 를 사용한다. 어차피, Android 에서는 Dynamic Link 가 부드럽게 동작한다.
  static openAndroidApp =
    "https://hypetalk.page.link/?link=https://hypetalk.page.link/LoginCallback/?apn=com.withcenter.hypetalk&token=";
  static openIosApp =
    "com.withcenter.hypetalk://hypetalk.page.link/LoginCallback/?token=";

  // -- 아래는 경우에 따라서 수정해야 한다. --
  // 사용자의 개인 정보가 저장되는 곳. 전화번호가 저장된다.
  // 만약, users 컬렉션에 모든 정보를 저장하고 싶으면,
  // userPublicDataCollectionName 을 userCollectionName 과 동일하기 하면된다.
  static userCollectionName = "users";

  // 사용자의 공개 정보가 저장되는 곳. 전화번호를 빼고 나머지 정보(이름, 생년월일, 성별)가 저장된다.
  static userPublicDataCollectionName = "users_public_data";

  // -- 공통: 아래는 전혀 수정 할 필요 없다 --

  // 모든 프로젝트에 동일. 업데이트 할 필요 없음.
  // 나이스 관리자 화면 -> 앱 상세 보기 -> 구성 상품 -> 상품 코드
  static productID = "2101979031";

  static apiUrl = "https://svc.niceapi.co.kr:22001";
  // access token 요청 uri
  static accessTokenRequestUri = "/digital/niceid/oauth/oauth/token";

  // 암호화 token 요청 uri
  static cryptoTokenRequestUri = "/digital/niceid/api/v1.0/common/crypto/token";
}
