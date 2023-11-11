import * as admin from "firebase-admin";

const app = admin.initializeApp({
    credential: admin.credential.cert(process.argv[2]),
});

const db = admin.firestore();
const col = db.collection("users");

(async () => {
 const snapshot = await col.get();
 if (snapshot.empty) {
   console.log("No matching documents.");
   return;
 }
 
 snapshot.forEach((doc) => {
   console.log(doc.id, "=>", doc.data());
 });
})();
