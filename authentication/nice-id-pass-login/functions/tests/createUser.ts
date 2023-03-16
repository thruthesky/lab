import * as admin from "firebase-admin";
import { Firebase } from "../src/firebase";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// 실행
doWork();

async function doWork() {
  await Firebase.createUser({
    display_name: "홍길동",
    phone_number: "01010009000",
    name: "홍길동",
    gender: "M",
    birthday: 19910203,
  });
}
