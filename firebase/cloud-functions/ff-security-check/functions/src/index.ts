import * as functions from "firebase-functions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const test = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send(`
    <html>
        <head>
            <title>Firebase Security Test</title>
        </head>
        <body>
        <div style="margin: 2em;">

            <h1>
                Enter your site url:
            </h1>
            <form action="https://us-central1-flutter-flow-korea.cloudfunctions.net/run" method="POST">
                <input type="text" name="url" />
                <input type="submit" value="Submit" />
            </form>
            </div>
        </body>
    </html>
  `);
});

export const run = functions.https.onRequest(async (request, response) => {
  // / get main.dart
  // / parse access
  // Initialize another app
  const app = initializeApp({
    apiKey: "AIzaSyBz2OFyac4LdNAA8jomtLlpSdBsO1BWyjY",
    authDomain: "withcenter-test-2.firebaseapp.com",
    databaseURL: "https://withcenter-test-2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "withcenter-test-2",
    storageBucket: "withcenter-test-2.appspot.com",
    messagingSenderId: "817502397544",
    appId: "1:817502397544:web:c3089782f014d4032487dd",
  });

  const db = getFirestore(app);
  const citiesCol = collection(db, "users");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      uid: data.uid,
      email: data.email,
      phoneNumber: data.phone_number,
      displayName: data.displa_name,
      photoUrl: data.photoUrl,
    };
  });
  console.log(cityList);
  response.send(cityList);
});
