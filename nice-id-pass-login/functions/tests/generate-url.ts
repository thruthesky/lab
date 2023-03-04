import { NiceApi } from "../src/nice";

// 실행
doWork();

async function doWork() {
  console.log("----> new work;");
  // const accessToken = await requestAccessToken();
  const companyAccessToken = "3655377d-f5e7-46e5-8361-7b3cded48626"; // accessToken.dataBody.access_token;

  console.log("access token: ", companyAccessToken);

  const cryptoToken = await NiceApi.requestCryptToken(companyAccessToken);

  console.log("crypto token body:", cryptoToken.dataBody);

  const symmetricKey = NiceApi.generateSymmetricKey(
    cryptoToken.dataBody.token_val
  );

  console.log("symmetricKey: ", symmetricKey);

  const encrypted = NiceApi.encryptRequestData(cryptoToken, symmetricKey);
  console.log("encrypted: ", encrypted);
  const detrypted = NiceApi.decryptRequestData(encrypted, symmetricKey);
  console.log("detrypted: ", detrypted);

  const integrity_value = NiceApi.hmac256(encrypted, symmetricKey.hmac_key);
  console.log("hmac(integrity_value): ", integrity_value);

  const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${cryptoToken.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;
  console.log("url: ", url);
}
