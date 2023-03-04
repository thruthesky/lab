import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
(async () => {
  const db = admin.firestore();

  const cafes = await db.collection("cafe").get();

  for (let i = 0; i < cafes.docs.length; i++) {
    const cafe = cafes.docs[i].data();
    console.log(cafe.name, cafe.noOfTables);
    let fiveTables = false;
    let tenTables = false;
    let twentyTables = false;
    let thirtyTables = false;
    if (cafe.noOfTables > 30) {
      fiveTables = true;
      tenTables = true;
      twentyTables = true;
      thirtyTables = true;
    } else if (cafe.noOfTables > 20) {
      fiveTables = true;
      tenTables = true;
      twentyTables = true;
    } else if (cafe.noOfTables > 10) {
      fiveTables = true;
      tenTables = true;
    } else if (cafe.noOfTables > 5) {
      fiveTables = true;
    }
    await cafes.docs[i].ref.update({
      fiveTables,
      tenTables,
      twentyTables,
      thirtyTables,
    });
  }
})();
