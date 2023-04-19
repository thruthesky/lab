import * as admin from "firebase-admin";

/**
 * Firestore 의 필드 값이 Realtime Database 에 저장할 수 있는 값으로 변환
 * @param value Firestore 의 필드 값
 * @returns Realtime Database 에 저장할 값으로 변환된 값
 */
export function mapValue(value: any): any {
  if (value instanceof admin.firestore.Timestamp) {
    // Firestore 의 Timestamp 를 Unix Timestamp 로 변환하여 저장
    // https://typesense.org/docs/0.22.2/api/collections.html#indexing-dates
    return Math.floor(value.toDate().getTime() / 1000);
  } else if (value instanceof admin.firestore.GeoPoint) {
    // Firestore 의 GeoPoint 를 [latitude, longitude] 로 변환하여 저장
    return [value.latitude, value.longitude];
  } else if (value instanceof admin.firestore.DocumentReference) {
    // Firestore 의 DocumentReference 를 경로 문자열로 변환하여 저장
    return { path: value.path };
  } else if (Array.isArray(value)) {
    // Firestore 의 배열의 각 요소를 mapValue 로 변환하여 저장
    return value.map(mapValue);
  } else if (typeof value === "object" && value !== null) {
    // object 또는 map
    return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, mapValue(value)]));
  } else {
    // 기타 string, number, boolean 등
    return value;
  }
}
