# Firestore 데이터를 Realtime Database 로 sync 하는 함수

- 어떤 용도라도 사용이 가능하다.
  예를 들면, Firestore 에서
  - 사용자 컬렉션인 /users 를 RTDB /users 로 sync 할 수 있으며,
  - 게시판 컬렉션인 /posts 를 RTDB 로 sync 하거나
  - 코멘트, 채팅 등 모든 것을 RTDB 로 sync 할 수 있다.


- 사용 방법
  - collection path 와 어떤 필드들을 sync 할 지 정해야 한다.
  - 참고로, 함수 하나에 collection path 하나만 지원된다.
    즉, 여러 collection 을 sync 하려면, index.ts 파일 안에서, 클라우드 함수를 복사하여 다른 함수 이름으로 지정하여 배포하면 된다.
  - 참고로, 지원하는 타입


- 커스터마이징
  - `keys/service-account.json` 파일을 본인의 프로젝트 service account 로 변경해야 한다.
  - `region` 이나 `함수명` 등을 직접 고쳐 쓰면 된다.


- 지원하는 필드 타입
  - 2023년 4월 현재, Firestore 에 있는 type 중에서 string, number, boolean, timestamp, geo point, document reference, array 등을 지원한다.
  - 참고, map 이나 object 는 테스트가 필요하다.



