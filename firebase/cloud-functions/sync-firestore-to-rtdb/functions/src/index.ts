import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

class Config {
  static readonly collections = ["user", "post"];
  static readonly region = "asia-northeast3";
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export const syncUser = functions
  .region(Config.region)
  .firestore.document("{collectionId}/{documentId}")
  .onCreate((snapshot, context) => {
    /// 코드 참조: https://github.com/typesense/firestore-typesense-search/blob/master/functions/src/indexToTypesenseOnFirestoreWrite.js
    console.log("Collection: " + context.params.collecId);
    console.log("Document: " + context.params.docId);
  });
