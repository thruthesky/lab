import axios from "axios";
import * as admin from "firebase-admin";
import { encodeBase32 } from "geohashing";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
(async () => {
  const db = admin.firestore();

  const cafes = await db.collection("cafe").get();

  for (let i = 0; i < cafes.docs.length; i++) {
    const cafe = cafes.docs[i].data();
    console.log(cafe.address);
    try {
      const { data } = await axios.get(
        "https://dapi.kakao.com/v2/local/search/address.json?query=" +
          cafe.address,
        {
          headers: {
            Authorization: "KakaoAK d4b43fbf2599b19b50ef43b3524f0165",
          },
        }
      );

      if (data?.documents?.length > 0) {
        const lon: string = (data.documents[0].x + "") as string;
        const lat: string = (data.documents[0].y + "") as string;
        console.log(lon, lat);

        const hash = encodeBase32(parseFloat(lat), parseFloat(lon));
        await cafes.docs[i].ref.update({
          latitude: lat,
          longitude: lon,
          geohash: hash,
          geohash4: hash.substring(0, 4),
          geohash5: hash.substring(0, 5),
          geohash6: hash.substring(0, 6),
          geohash7: hash.substring(0, 7),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
})();
