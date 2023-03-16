// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { firebaseConfig } from "./keys/keys";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
