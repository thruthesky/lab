import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Config} from "./config";
import {NiceApi} from "./nice-api";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const niceAuth = functions
    .runWith({
      vpcConnector: "pass-connector",
      vpcConnectorEgressSettings: "ALL_TRAFFIC",
    })
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
      functions.logger.info("niceAuth(); ", {structuredData: true});
      const auth = await NiceApi.requestCryptToken(Config.accessToken);
      NiceApi.generateSymmetricKey(auth);
      const encrypted = NiceApi.encryptData(auth);
      const integrity_value = await NiceApi.hmac256(encrypted, auth);
      const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${auth.crypto.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;

      response.redirect(url);
    //   response.send("Hello from Firebase!" + JSON.stringify(cryptoToken));
    });

export const niceAuthCallback = functions
    .runWith({
      vpcConnector: "pass-connector",
      vpcConnectorEgressSettings: "ALL_TRAFFIC",
    })
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
      functions.logger.info("niceAuthCallback(); ", {structuredData: true});
      response.send("niceAuthCallback(); " + JSON.stringify(request.body));
    });
