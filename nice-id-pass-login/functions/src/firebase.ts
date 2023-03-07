import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { Config } from "./config";
import { UserData } from "./firebase.interface";

export class Firebase {
  /**
   * 인증 후 암호화된 데이터를 복호화하기 위해서는 key, iv 정보가 필요한데, 이 값을 임시 문서에 저장한다.
   *
   * @returns temp collection reference
   */
  static niceApiCol() {
    return admin.firestore().collection("temp-nice-api");
  }

  static userDoc(uid: string) {
    return admin.firestore().collection(Config.userCollectionName).doc(uid);
  }
  static userPublicDoc(uid: string) {
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
    const auth = admin.auth();
    try {
      return await auth.getUserByPhoneNumber(user.phone_number);
    } catch (error) {
      console.log(error);
      const userRecord = await auth.createUser({
        displayName: user.name,
        phoneNumber: user.phone_number,
      });

      const promises: Promise<any>[] = [
        this.userDoc(userRecord.uid).set({
          phone_number: user.phone_number,
        }),
        this.userPublicDoc(userRecord.uid).set({
          display_name: user.name,
          birthday: user.birthday,
          gender: user.gender,
        }),
      ];
      await Promise.all(promises);

      return userRecord;
    }
  }
}
