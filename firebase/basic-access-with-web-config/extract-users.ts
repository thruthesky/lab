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
  apiKey: "AIza-------------a19BzI",
  authDomain: "----------.firebaseapp.com",
  projectId: "----------",
  storageBucket: "----------.firebaseapp.com",
  messagingSenderId: "817502397544",
  appId: "1:87238516------------984908175",
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
