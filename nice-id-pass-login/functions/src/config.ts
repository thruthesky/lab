/**
 * Config
 *
 * 나이스 PASS 본인 확인 설정
 */
export class Config {
  // 나이스 관리자 화면 -> 앱 상세 보기 -> 키 조회
  static clientId = "b48a6fd7-19a2-4819-8c4d-cec0a7ccf552";
  static clientSecret = "4d9f792b5d5ed8ec7a9a203d803a75e8";

  // 나이스 관리자 화면 -> 앱 상세 보기 -> 구성 상품 -> 상품 코드
  static productID = "2101979031";

  // 기관(가맹사) 액세스 토큰. 50 년 동안 유효하다. 즉, 한번만 호출해서, 그 값을 재 사용하면 된다.
  static accessToken = "3655377d-f5e7-46e5-8361-7b3cded48626";

  // 암호화 토큰은 최대 1 시간까지 유효.
  // 즉, 최대 1 시간 동안 암호화 토큰을 재 활용 할 수 있다.
  // Nice API 를 통해서 암호화 토큰을 요청하지 않고, Firestore 에 저장해 놓으면 보다 빠르게
  // 재 활용 할 수 있다.
  // 캐시를 안하려면 그냥 숫자 1 을 적으면 되고, 캐시를 하려면, 60 * 50 (50분)으로 한다.
  static cryptoTokenRequestInterval = 1; // 60 * 50; // 60 * 50 = 50분.

  static apiUrl = "https://svc.niceapi.co.kr:22001";
  // access token 요청 uri
  static accessTokenRequestUri = "/digital/niceid/oauth/oauth/token";

  // 암호화 token 요청 uri
  static cryptoTokenRequestUri = "/digital/niceid/api/v1.0/common/crypto/token";

  // 리턴 URL, 콜백 URL
  static returnUrl =
    "https://asia-northeast3-hype-9f920.cloudfunctions.net/niceAuthCallback";
}
