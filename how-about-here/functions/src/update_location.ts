import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
(async () => {
  const db = admin.firestore();

  const cafes = await db.collection("cafe").get();

  for (let i = 0; i < cafes.docs.length; i++) {
    const cafe = cafes.docs[i].data();
    // console.log(cafe.latitude, cafe.longitude);
    if (cafe.latitude === undefined || cafe.longitude === undefined) {
      await cafes.docs[i].ref.delete();
      continue;
    }

    await cafes.docs[i].ref.update({
      location: new admin.firestore.GeoPoint(
        parseFloat(cafe.latitude),
        parseFloat(cafe.longitude)
      ),
    });
  }
})();
