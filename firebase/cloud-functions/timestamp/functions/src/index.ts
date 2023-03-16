import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

(async () => {
  const snapshot = await db.collection("users").get();
  snapshot.docs.map((doc) => console.log(doc.data()));
})();
