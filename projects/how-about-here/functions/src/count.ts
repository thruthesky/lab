import * as admin from "firebase-admin";
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

let count = 0;
db.collection("cafe")
  .get()
  .then((snapshot) => {
    console.log("count; ", snapshot.size);
    snapshot.forEach((doc) => {
      count++;
      console.log(count, doc.id, "=>", doc.data());
    });
  });
