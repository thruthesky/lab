import * as functions from "firebase-functions";
import {Config} from "./config";
import {NiceApi} from "./nice";

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
      const cryptoToken = await NiceApi.requestCryptToken(Config.accessToken);
      const symmetricKey = NiceApi.generateSymmetricKey(
          cryptoToken.dataBody.token_val
      );
      const encrypted = NiceApi.encryptRequestData(cryptoToken, symmetricKey);
      const integrity_value = NiceApi.hmac256(encrypted, symmetricKey.hmac_key);
      const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${cryptoToken.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;

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
