import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
} from "firebase/firestore/lite";

// TODO: Replace the following with your app's Firebase project configuration

const firebaseConfig = {
  apiKey: "-------------H7ibPE",
  authDomain: "---------.firebaseapp.com",
  projectId: "---------",
  storageBucket: "---------.appspot.com",
  messagingSenderId: "1036885997348",
  appId: "1:103688---------------db460725b1",
};

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
