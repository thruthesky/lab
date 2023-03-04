export class Config {
  static clientId = "b48a6fd7-19a2-4819-8c4d-cec0a7ccf552";
  static clientSecret = "4d9f792b5d5ed8ec7a9a203d803a75e8";

  // 나이스 관리자 화면 -> 앱 상세 보기 -> 구성 상품 -> 상품 코드
  static productID = "2101979031";

  static apiUrl = "https://svc.niceapi.co.kr:22001";
  // access token 요청 uri
  static accessTokenRequestUri = "/digital/niceid/oauth/oauth/token";

  // 암호화 token 요청 uri
  static cryptoTokenRequestUri = "/digital/niceid/api/v1.0/common/crypto/token";

  // 리턴 URL, 콜백 URL
  static returnUrl = "http://localhost:3000/returnUrl";
}
