// import * as admin from "firebase-admin";
// admin.initializeApp();
// const db = admin.firestore();

const n = 19731016;
const birthday = n.toString();
const dateOfBirthday = new Date(
  birthday.substring(0, 4) +
    "-" +
    birthday.substring(4, 6) +
    "-" +
    birthday.substring(6, 8)
);

console.log(dateOfBirthday.toDateString());
