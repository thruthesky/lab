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
      // const url = `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?m=service&token_version_id=${auth.crypto.dataBody.token_version_id}&enc_data=${encrypted}&integrity_value=${integrity_value}`;

      // response.redirect(url);

      response.send(`
<html>
<body>
<form name="form_chk" id="form_chk" method="get" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb">
    <input type="hidden" id="m" name="m" value="service" />
    <input type="hidden" id="token_version_id" name="token_version_id" value="${auth.crypto.dataBody.token_version_id}" />
    <input type="hidden" id="enc_data" name="enc_data" value="${encrypted}" />
    <input type="hidden" id="integrity_value" name="integrity_value" value="${integrity_value}" />
    <!--<a href="javascript:fnSubmit();"> CheckPlus 안심본인인증 Click</a>-->
</form>
<script language='javascript'>
    function fnSubmit(){
        document.form_chk.submit();
    }
    window.addEventListener("load", (event) => {
      document.form_chk.submit();
    });
</script>
</body>
</html>
    `);
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
