import * as admin from "firebase-admin";
import {UserRecord} from "firebase-admin/auth";
import {Config} from "./config";
import {UserData} from "./firebase.interface";

/**
 * Firebase 관련 함수
 *
 * Firestore 에 Nice API 인정 정보를 임시로 저장하고, 사용자 정보를 생성/관리 한다.
 */
export class Firebase {
  /**
   * 인증 후 암호화된 데이터를 복호화하기 위해서는 key, iv 정보가 필요한데, 이 값을 임시 문서에 저장한다.
   *
   * @returns temp collection reference
   */
  static niceApiCol() {
    return admin.firestore().collection("temp-nice-api");
  }

  /**
   * 사용자 레퍼런스 리턴
   *
   * @param uid user id
   * @returns referenc
   */
  static userDoc(uid: string): admin.firestore.DocumentReference {
    return admin.firestore().collection(Config.userCollectionName).doc(uid);
  }

  /**
   * 사용자 공개 문서 레퍼런스 리턴
   *
   * @param uid user id
   * @returns referenc
   */
  static userPublicDoc(uid: string): admin.firestore.DocumentReference {
    return admin
        .firestore()
        .collection(Config.userPublicDataCollectionName)
        .doc(uid);
  }

  /**
   * Update Firebase user with the given email, create if none exists
   * @param {UserData} user
   */
  static async createUser(user: UserData): Promise<UserRecord> {
    // get user by phone number
    if (user.phone_number.charAt(0) === "0") {
      user.phone_number = "+82" + user.phone_number.substring(1);
    }
    Config.trace(
        "firebase.ts::createUser() -> user.phone_number ",
        user.phone_number
    );
    const auth = admin.auth();
    try {
      // if user exists? then just return
      const userRecord = await auth.getUserByPhoneNumber(user.phone_number);
      Config.trace(
          "firebase.ts::createUser() user found -> userRecord ",
          userRecord
      );
      return userRecord;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Config.trace("firebase.ts::createUser() -> catch(); ", error.code);
      if (error.code === "auth/user-not-found") {
        Config.trace(
            "firebase.ts:: Creating user: ",
            user.name,
            user.phone_number
        );
        const userRecord = await auth.createUser({
          displayName: user.name,
          phoneNumber: user.phone_number,
        });

        const publicData = {
          displayName: user.name,
          birthday: this.convertYYYYMMDD(user.birthday),
          gender: user.gender,
          userDocumentReference: this.userDoc(userRecord.uid),
          registeredA: admin.firestore.FieldValue.serverTimestamp(),
        };

        Config.trace("firebase.ts::createUser() -> publicData: ", publicData);

        // 사용자 정보를 저장(생성)한다.
        // users collection 하나만 쓰면, 공개 문서 컬렉션도 users collection 으로 지정하면 된다.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promises: Promise<any>[] = [
          this.userDoc(userRecord.uid).set({
            uid: userRecord.uid,
            email: "",
            name: user.name,
            display_name: user.name,
            phone_number: user.phone_number,
            photo_url: "",
            created_time: admin.firestore.FieldValue.serverTimestamp(),
          }),

          this.userPublicDoc(userRecord.uid).set(publicData),
        ];
        await Promise.all(promises);

        return userRecord;
      } else {
        throw error;
      }
    }
  }

  /**
   * Convert the birthday in YYYYMMDD format to Date
   *
   * @param n birthday in YYYYMMDD format
   * @returns Date of birthday
   */
  static convertYYYYMMDD(n: number): Date {
    const birthday = n.toString();

    const dateOfBirthday = new Date(
        birthday.substring(0, 4) +
        "-" +
        birthday.substring(4, 6) +
        "-" +
        birthday.substring(6, 8)
    );
    return dateOfBirthday;
  }
}
