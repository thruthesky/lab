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

export interface CryptoToken {
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
}

export interface SymmetricKey {
  result: string;
  key: string;
  hmac_key: string;
  iv: string;
}
