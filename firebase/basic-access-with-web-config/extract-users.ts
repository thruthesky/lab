// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
} from "firebase/firestore/lite";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFftOCp56XpeV9dM3mJbd95L7W_a19BzI",
  authDomain: "withcenter-kmeet.firebaseapp.com",
  projectId: "withcenter-kmeet",
  storageBucket: "withcenter-kmeet.firebaseapp.com",
  messagingSenderId: "817502397544",
  appId: "1:872385163952:web:217e415c89d6f984908175",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
// Get a list of cities from your database
async function getUsers(db: Firestore) {
  const usersCol = collection(db, "users_public_data");
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map((doc) => doc.data());
  return userList;
}

getUsers(db).then((users) => {
  console.log(users);
});
