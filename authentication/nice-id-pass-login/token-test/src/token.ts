import axios from "axios";
import { Buffer } from "buffer";
import {
  createHash,
  createCipheriv,
  createDecipheriv,
  createHmac,
} from "node:crypto";
import { Config } from "./config.js";
import { AccessToken, CryptoToken, SymmetricKey } from "./interfaces.js";

// 시간 값은 한국 시간 값이어야 한다. UTC+0 으로 하면 안된다.
// Get date string of YYYYMMDDHHmmss
const dt = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
  .toISOString()
  .replace(/[-:T]/g, "")
  .slice(0, 14);
// const dt = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
console.log("---> dt; ", dt);

// 실행
doWork();

async function doWork() {
  console.log("----> new work;");
  // const accessToken = await requestAccessToken();
  const companyAccessToken = "3655377d-f5e7-46e5-8361-7b3cded48626"; // accessToken.dataBody.access_token;

  console.log("access token: ", companyAccessToken);

  const cryptoToken = await requestCryptToken(companyAccessToken);

  console.log("equest crypto token result -> body:", cryptoToken.dataBody);

  const symmetricKey = generateSymmetricKey(cryptoToken.dataBody.token_val);

  console.log("symmetricKey: ", symmetricKey);

  const encrypted = encryptRequestData(cryptoToken, symmetricKey);
  console.log("encrypted: ", encrypted);
  const detrypted = decryptRequestData(encrypted, symmetricKey);
  console.log("detrypted: ", detrypted);

  const integrity_value = hmac256(encrypted, symmetricKey.hmac_key);
  console.log("hmac(integrity_value): ", integrity_value);

  const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${cryptoToken.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;
  console.log("url: ", url);
}

/**
 * 기관 토큰은 한번 발급 받으면 50년간 쓸 수 있다. 즉, 영구적으로 쓸 수 있으므로, 한번만 받아서 캐시하거나, 소스코드에 넣어 놓는다.
 * @returns 기관 토큰 (고객사 토큰)
 */
async function requestAccessToken(): Promise<AccessToken> {
  // Base64 인코딩
  const bearer64 = Buffer.from(
    `${Config.clientId}:${Config.clientSecret}`
  ).toString("base64");

  // Content-Type 이 application/x-www-form-urlencoded 인 경우
  // Post data 를 아래와 같이 URLSearchParams 로 넣어서 보내야 한다.
  // 참고: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams#examples
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "default",
  });

  console.log("base64", bearer64);
  const res = await axios.post(
    `${Config.apiUrl}${Config.accessTokenRequestUri}`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${bearer64}`,
      },
    }
  );

  return res.data;
}

/**
 * 암호화 토큰을 요청한다.
 *
 * 참고: https://docs.google.com/document/d/1wBdOWI69DzoI7_BESC-nQsn7UQdZ0WUQtYoOg_22JmI/edit#heading=h.yaeo2a78szzj
 *
 * @param access_token Access Token
 * @returns 암호화 토큰
 */
async function requestCryptToken(access_token: string): Promise<CryptoToken> {
  const sourceKey =
    access_token +
    ":" +
    Math.round(new Date().getTime() / 1000) +
    ":" +
    Config.clientId;

  console.log("--> sourceKey: ", sourceKey);
  const bearer64 = Buffer.from(sourceKey).toString("base64");

  const params = {
    dataHeader: { CNTY_CD: "ko" },
    dataBody: {
      req_dtim: dt,
      req_no: dt,
      enc_mode: "1",
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${bearer64}`,
    client_id: Config.clientId,
    productID: Config.productID,
  };

  const res = await axios.post(
    `${Config.apiUrl}${Config.cryptoTokenRequestUri}`,
    params,
    {
      headers: headers,
    }
  );

  return res.data;
}

/**
 * 대칭키 생성.
 *
 * Sha256 로 해시를 생성하고, 16 바이트 키와 32 바이트 HMAC 키, 16 바이트 IV 를 생성한다.
 *
 * @param password 비밀번호
 * @returns 대칭키
 */
function generateSymmetricKey(token_val: string): SymmetricKey {
  const password = `${dt}${dt}${token_val.trim()}`;
  console.log("password;", password);

  // sha256 알고리즘을 사용하여 해시를 생성한다.
  const hashedPassword = createHash("sha256")
    // 비밀번호를 해시로 추가한다.
    .update(password)
    // 해시로 부터 digest 를 계산해 주는 함수이다. base64 로 인코딩한다.
    .digest("base64");

  return {
    result: hashedPassword,
    key: hashedPassword.substring(0, 16),
    hmac_key: hashedPassword.substring(0, 32),
    iv: hashedPassword.substring(hashedPassword.length - 16),
  } as SymmetricKey;
}

/**
 * 대칭키를 사용하여 요청 데이터를 대칭 암호화한다.
 *
 * 참고: https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-crypto-%EB%AA%A8%EB%93%88-%EC%95%94%ED%98%B8%ED%99%94
 * 참고: https://defineall.tistory.com/701
 * 참고: https://pongsoyun.tistory.com/141
 *
 * @param cryptoToken 암호화 토큰 요청에서 받은 결과
 * @param symmetricKey 대칭키
 */
function encryptRequestData(
  cryptoToken: CryptoToken,
  symmetricKey: SymmetricKey
): string {
  // 128 은 키 16 바이트
  // 192 은 키 24 바이트
  // 256 은 키 32 바이트
  const algorithm = "aes-128-cbc";
  const key = symmetricKey.key;
  const iv = symmetricKey.iv;

  const reqData = {
    requestno: dt,
    returnurl: Config.returnUrl,
    sitecode: cryptoToken.dataBody.site_code,
    authtype: "M",
    businessno: "6368602965", // 법인인 경우만 사업자 번호 입력
    methodtype: "get",
    popupyn: "N",
    receivedata: "developer_status_code_123",
  };

  const cipher = createCipheriv(algorithm, key, iv);
  const encryptedData =
    cipher.update(JSON.stringify(reqData), "utf8", "base64") +
    cipher.final("base64");

  return encryptedData;
}

/**
 * encryptRequestData() 함수로 암호화된 데이터를 복호화한다.
 *
 * @param encrypted 암호화 된 데이터(문자열)
 * @param symmetricKey 대칭키
 * @returns 복호화된 데이터(문자열)
 */
function decryptRequestData(
  encrypted: string,
  symmetricKey: SymmetricKey
): any {
  const algorithm = "aes-128-cbc";
  const key = symmetricKey.key;
  const iv = symmetricKey.iv;

  const decipher = createDecipheriv(algorithm, key, iv);
  const decryptedData =
    decipher.update(encrypted, "base64", "utf8") + decipher.final("utf8");

  return decryptedData;
}

/**
 * Hmac 무결성 검증을 위한 integrity_value (HMAC 검증을 위한 값) 값을 리턴한다.
 * @param encrypted 인코딩된 데이터
 * @param hmac_key Hmac Key
 * @returns 무결성 검증을 위한 HMAC
 */
function hmac256(encrypted: string, hmac_key: string): string {
  return createHmac("sha256", hmac_key).update(encrypted).digest("base64");
}
