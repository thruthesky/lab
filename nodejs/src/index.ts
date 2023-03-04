import { createHash, pbkdf2, randomBytes } from "node:crypto";

/**
 * createHash() 에는 algorithm, options 두 가지 인자가 있다.
 * 참고: 공홈 v18, createHash 함수 https://nodejs.org/dist/latest-v18.x/docs/api/crypto.html#cryptocreatehashalgorithm-options
 * @param password password
 */
function createHashPassword(password: string) {
  // sha512 알고리즘을 사용하여 해시를 생성한다.
  const hashedPassword = createHash("sha512")
    // 비밀번호를 해시로 추가한다.
    .update(password)
    // 해시로 부터 digest 를 계산해 주는 함수이다. base64 로 인코딩한다.
    .digest("base64");

  console.log("hash : ", hashedPassword);
}

function createPbkdf2Password(password: string) {
  // 랜덤한 문자열(salt)를 32 바이트로 생성.
  randomBytes(32, (err, salt) => {
    // 입력 받은 비비밀번호와 salt를 이용해서 해시를 생성.
    // 1만 번 반복해서 해시를 생성.
    // 64 바이트 길이의 해시를 생성.
    // sha512 알고리즘을 사용.
    // 콜백 함수를 전달하고, 에러가 발생하면 에러를 처리, 성공하면 결과 해시 비밀번호(키) 가 파라메터로 전달.
    pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
      console.log("pbkdf2 password: ", derivedKey.toString("base64"));
    });
  });
}

createHashPassword("password123");
createPbkdf2Password("password123");
