import * as admin from "firebase-admin";
import { data1 } from "./data";
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// Get a new write batch
const batch = db.batch();

for (let i = 0; i < data1.length; i++) {
  const cafe = data1[i] as any;

  const docRef = db.collection("cafe").doc();

  cafe.menus = cafe.menu;
  delete cafe.menu;

  if (!cafe.noOfTables) {
    cafe.noOfTables = 0;
  }
  cafe.noOfTables = parseInt(cafe.noOfTables ?? "0");
  if (isNaN(cafe.noOfTables) || cafe.noOfTables < 0) {
    cafe.noOfTables = 0;
  }

  cafe.createdAt = admin.firestore.FieldValue.serverTimestamp();

  console.log(cafe.area);
  batch.set(docRef, cafe);
}

// Commit the batch
batch.commit();
