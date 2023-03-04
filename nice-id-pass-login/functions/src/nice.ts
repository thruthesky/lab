import axios from "axios";

import { Config } from "./config";
import { CryptoToken } from "./interfaces";

export class NiceApi {
  // 시간 값은 한국 시간 값이어야 한다. UTC+0 으로 하면 안된다.
  // Get date string of YYYYMMDDHHmmss
  static dt: string = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);

  /**
   * 암호화 토큰을 요청한다.
   *
   * 참고: https://docs.google.com/document/d/1wBdOWI69DzoI7_BESC-nQsn7UQdZ0WUQtYoOg_22JmI/edit#heading=h.yaeo2a78szzj
   *
   * @param access_token Access Token
   * @returns 암호화 토큰
   */
  static async requestCryptToken(access_token: string): Promise<CryptoToken> {
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
        req_dtim: this.dt,
        req_no: this.dt,
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
}
