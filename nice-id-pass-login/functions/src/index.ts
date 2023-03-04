import * as functions from "firebase-functions";
import { Config } from "./config";
import { NiceApi } from "./nice";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    const cryptoToken = await NiceApi.requestCryptToken(Config.accessToken);
    response.send("Hello from Firebase!" + JSON.stringify(cryptoToken));
  }
);
