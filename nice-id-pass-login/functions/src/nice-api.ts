import * as admin from "firebase-admin";
import axios from "axios";
import {
  createHash,
  createCipheriv,
  createDecipheriv,
  createHmac,
} from "node:crypto";
import {Config} from "./config";
import {AccessToken, AuthData, SymmetricKey} from "./interfaces";

/**
 * Nice API
 *
 * 참고: https://docs.google.com/document/d/1wBdOWI69DzoI7_BESC-nQsn7UQdZ0WUQtYoOg_22JmI/edit#heading=h.yaeo2a78szzj
 */
export class NiceApi {
  /**
   * Thsi is the cache document reference.
   * @returns the cache document reference
   */
  static docRef(): admin.firestore.DocumentReference {
    const db = admin.firestore();
    const docRef = db.collection("tmp").doc("nice-api");
    return docRef;
  }
  /**
   * 기관 토큰은 한번 발급 받으면 50년간 쓸 수 있다. 즉, 영구적으로 쓸 수 있으므로, 한번만 받아서 캐시하거나,
   * 소스코드에 넣어 놓는다.
   * @returns 기관 토큰 (고객사 토큰)
   */
  static async requestAccessToken(): Promise<AccessToken> {
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
            "Authorization": `Basic ${bearer64}`,
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
   * @return Promise<CryptoToken> 암호화 토큰
   */
  static async requestCryptToken(access_token: string): Promise<AuthData> {
    // 시간 값은 한국 시간 값이어야 한다. UTC+0 으로 하면 안된다.
    const koreanDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);

    // 캐시된 암호화 토큰이 있으면 캐시된 암호화 토큰을 사용해야 한다.
    // 너무 빨리/자주 암호화 토큰을 요청하면 본인 인증 (복호화) 오류가 발생한다.

    const docSnapshot = await this.docRef().get();
    if (docSnapshot.exists) {
      const cache = docSnapshot.data() as AuthData;
      if (cache) {
        const now = new Date();
        const timestamp = cache.timestamp as admin.firestore.Timestamp;
        console.log(timestamp);
        const diff = now.getTime() - timestamp.toMillis();
        const diffSeconds = diff / 1000;
        console.log("diffSeconds", diffSeconds);
        if (diffSeconds < Config.cryptoTokenRequestInterval) {
          console.log("----> use cached data !");
          cache.cached = true;
          return cache;
        }
      }
    }

    // Get date string of YYYYMMDDHHmmss
    const dateTime: string = koreanDate
        .toISOString()
        .replace(/[-:T]/g, "")
        .slice(0, 14);

    const seconds: number = Math.round(koreanDate.getTime() / 1000);

    const requestNo = "REQ" + (koreanDate.getTime() + "").padStart(27, "0");

    const authorizationSourceKey =
      access_token + ":" + seconds + ":" + Config.clientId;

    const bearer64 = Buffer.from(authorizationSourceKey).toString("base64");

    const params = {
      dataHeader: {CNTY_CD: "ko"},
      dataBody: {
        req_dtim: dateTime,
        req_no: requestNo,
        enc_mode: "1",
      },
    };

    console.log("--> authorizationSourceKey: ", authorizationSourceKey, params);

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `bearer ${bearer64}`,
      // client_id: Config.clientId,
      "productID": Config.productID,
    };

    const res = await axios.post(
        `${Config.apiUrl}${Config.cryptoTokenRequestUri}`,
        params,
        {
          headers: headers,
        }
    );

    const auth = {} as AuthData;
    auth.cached = false;
    auth.companyAccessToken = access_token;
    auth.crypto = res.data;
    auth.requestCryptoAuthorizationSourceKey = authorizationSourceKey;
    auth.requestCryptoAuthorizationBearer64 = bearer64;
    auth.requestCryptoTokenHeaders = headers;
    auth.requestCrytoBody = params;
    auth.timestamp = admin.firestore.FieldValue.serverTimestamp();
    auth.dateTime = dateTime;
    auth.requestNo = requestNo;

    return auth;
  }

  /**
   * 대칭키 생성.
   *
   * Sha256 로 해시를 생성하고, 16 바이트 키와 32 바이트 HMAC 키, 16 바이트 IV 를 생성한다.
   *
   * @param password 비밀번호
   * @returns 대칭키
   */
  static generateSymmetricKey(auth: AuthData): AuthData {
    const password =
      auth.dateTime.trim() +
      auth.requestNo.trim() +
      auth.crypto.dataBody.token_val.trim();
    console.log("password;", password);

    // sha256 알고리즘을 사용하여 해시를 생성한다.
    const hashedPassword = createHash("sha256")
    // 비밀번호를 해시로 추가한다.
        .update(password)
    // 해시로 부터 digest 를 계산해 주는 함수이다. base64 로 인코딩한다.
        .digest("base64");

    auth.symmetricKey = {
      result: hashedPassword,
      key: hashedPassword.substring(0, 16),
      hmac_key: hashedPassword.substring(0, 32),
      iv: hashedPassword.substring(hashedPassword.length - 16),
    } as SymmetricKey;

    return auth;
  }

  /**
   * 대칭키를 사용하여 요청 데이터를 대칭 암호화한다.
   *
   * @param cryptoToken 암호화 토큰 요청에서 받은 결과
   * @param symmetricKey 대칭키
   *
   *
   * 참고: https://inpa.tistory.com/entry/NODE-%F0%9F%93%9A-crypto-%EB%AA%A8%EB%93%88-%EC%95%94%ED%98%B8%ED%99%94
   * 참고: https://defineall.tistory.com/701
   * 참고: https://pongsoyun.tistory.com/141
   *
   * 참고로, PKCS7 은 자동 적용되며, PKCS5 와 PKCS7 은 동일한 것이다.
   */
  static encryptData(auth: AuthData): string {
    // 128 은 키 16 바이트
    // 192 은 키 24 바이트
    // 256 은 키 32 바이트
    const algorithm = "aes-128-cbc";
    const key = auth.symmetricKey.key;
    const iv = auth.symmetricKey.iv;

    const reqData = {
      requestno: auth.requestNo,
      returnurl: Config.returnUrl,
      sitecode: auth.crypto.dataBody.site_code,

      authtype: "M",
      mobilceco: "S",
      businessno: "6368602965", // 법인인 경우만 사업자 번호 입력
      methodtype: "get",
      popupyn: "N",
      receivedata: "developer state code" + auth.dateTime,
    };

    const cipher = createCipheriv(algorithm, key, iv);
    // cipher.setAutoPadding(true); // PKCS7 자동 적용됨.
    const encryptedData =
      cipher.update(JSON.stringify(reqData), "utf8", "base64") +
      cipher.final("base64");

    auth.encrypted = encryptedData;
    return encryptedData;
  }

  /**
   * encryptData() 함수로 암호화된 데이터를 복호화한다.
   *
   * @param encrypted 암호화 된 데이터(문자열)
   * @param symmetricKey 대칭키
   * @returns 복호화된 데이터(문자열)
   */
  static decryptData(encrypted: string, auth: AuthData) {
    const algorithm = "aes-128-cbc";
    const key = auth.symmetricKey.key;
    const iv = auth.symmetricKey.iv;

    const decipher = createDecipheriv(algorithm, key, iv);
    const decryptedData =
      decipher.update(encrypted, "base64", "utf8") + decipher.final("utf8");

    auth.decrypted = decryptedData;
    return decryptedData;
  }

  /**
   * Hmac 무결성 검증을 위한 integrity_value (HMAC 검증을 위한 값) 값을 리턴한다.
   * @param encrypted 인코딩된 데이터
   * @param hmac_key Hmac Key
   * @returns 무결성 검증을 위한 HMAC
   */
  static async hmac256(encrypted: string, auth: AuthData): Promise<string> {
    const hmac = createHmac("sha256", auth.symmetricKey.hmac_key)
        .update(encrypted)
        .digest("base64");
    if (auth.cached == false) {
      auth.integrity_value = hmac;
      await this.docRef().set(auth);
    } else {
      console.log("--------> Don't update cache.");
    }
    return hmac;
  }
}
