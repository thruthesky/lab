import * as admin from "firebase-admin";
export interface AccessToken {
  dataHeader: {
    GW_RSLT_CD: string;
    GW_RSLT_MSG: string;
  };
  dataBody: {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };
}

export interface AuthData {
  cached: boolean;
  companyAccessToken: string;
  crypto: {
    dataHeader: {
      CNTY_CD: string;
      GW_RSLT_CD: string;
      GW_RSLT_MSG: string;
    };
    dataBody: {
      rsp_cd: string;
      result_cd: string;
      site_code: string;
      token_version_id: string;
      token_val: string;
      period: number;
    };
  };
  requestCryptoAuthorizationSourceKey: string;
  requestCryptoAuthorizationBearer64: string;
  requestCryptoTokenHeaders: {
    [key: string]: string;
  };
  requestCrytoBody: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  symmetricKey: SymmetricKey;
  integrity_value: string;
  dateTime: string;
  requestNo: string;
  timestamp?: admin.firestore.FieldValue;

  encrypted: string;
  decrypted: string;
}

export interface SymmetricKey {
  result: string;
  key: string;
  hmac_key: string;
  iv: string;
}
