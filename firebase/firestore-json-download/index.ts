// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

import * as fs from 'node:fs';



// Initialize Firebase from the config file specified in the command line by reading the config file with fs.readFileSync and parsing the JSON string with JSON.parse
const config = JSON.parse( fs.readFileSync( process.argv[2] ).toString() );




// Initialize Firebase
const app = initializeApp(
    config
);


const db = getFirestore();
const col = collection(db, "users");


(async () => {
 const snapshot = await getDocs(query(col));
 if (snapshot.empty) {
   console.log("No matching documents.");
   return;
 }


 snapshot.forEach((doc) => {
   console.log(doc.id, "=>", doc.data());
 });
})();
