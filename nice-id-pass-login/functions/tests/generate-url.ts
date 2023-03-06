import * as admin from "firebase-admin";
import { Config } from "../src/config";
import { NiceApi } from "../src/nice-api";
import * as open from "open";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// 실행
doWork();

async function doWork() {
  Config.cryptoTokenRequestInterval = 1;

  // const accessToken = await requestAccessToken();
  const companyAccessToken = "3655377d-f5e7-46e5-8361-7b3cded48626"; // accessToken.dataBody.access_token;

  console.log("access token: ", companyAccessToken);

  const auth = await NiceApi.requestCryptToken(companyAccessToken);

  NiceApi.generateSymmetricKey(auth);

  const encrypted = NiceApi.encryptData(auth);
  const detrypted = NiceApi.decryptData(encrypted, auth);

  const integrity_value = await NiceApi.hmac256(encrypted, auth);

  const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${auth.crypto.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;

  console.log("encrypted: ", encrypted);
  console.log("detrypted: ", detrypted);
  console.log("hmac(integrity_value): ", integrity_value);
  console.log("auth: ", auth);
  console.log("url: ", url);

  // Opens the URL in the default browser.
  await open(url);
}
