# Lab

* 2023 년 부터, 개발에 필요한 코드를 보관하는 것으로 실제 사용 할 수 있는 코드들이 많으므로 각 프로젝트(폴더)의 README 를 잘 읽어 보고 사용하면 된다.
  오랜동안 코드를 `lab` 폴더에 모아 놓으면 이상하게 사라지고 했는데, (git 에 보면, 여기 저기 흩어져 있을 듯) 2023년 부터는 `lab` 폴더를 통째로 Git repo 에 보관한다.

* 본 repo 는 공개되는 repo 이다. 그래서 키 관리를 잘 해야 한다.
  * 모든 키는 반드시 `keys` (또는 `key`) 폴더 아래에 보관해야 한다. `keys` 폴더는 .gitignore 에 등록되어 git repo 에 저장되지 않는다.
    예를 들면, 키를 .ts 파일에 보관 할 때에는 `./abc/keys/api-key.ts` 와 같이 하면 된다.
  * 만약, 키(비밀번호)가 반드시 소스 코드에 들어가야 하는 상황이라면, 플랫폼/언어를 변경해서라도 비밀번호는 *.keys 파일에 보관하도록 한다.

* 그리고, 쓸데 없는 (용량이 큰) 코드가 git repo 에 올라가지 않도록 잘 관리 해야 한다.


# 중요한 코드 목록


* `authentication/nice-id-pass-login` 나이스 본인 인증 - NICE PASS 본인 확인 - 해당 README 파일 참고
* `docker/*` 도커 설정이 들어가 있다.
  * `docker/docker-emp` Enginx, MariadB, PHP 가 들어가 있는 도커. 쉽게 시스템 셋업을 할 수 있다.
  * `docker/docker-meilisearch` Meilisearch 에 대한 도커 설정
* `ffloader` FlutterFlow auto loader
* `firebase/cloud-functions` 파이어베이스 클라우드 함수 관련 코드. 이 폴더에 중요한 코드들이 많다. 특히, 곧바로 사용가능한 코드들이 있으므로 꼭 README 를 참고한다.
  * `firebase/cloud-functions/sync-firestore-rtdb` Firestore 의 모든 데이터를 rtdb 로 sync 하는 클라우드 함수 (미완성)
* `firebase/get_users` 파이어베이스의 접속 키로 다른 파이어베이스의 정보 긁어 오기
* `openai/data` GPT Fine Tuning 에 대한 정보가 들어가 있다.
* `rest-client` VSCode 의 Rest client extension 으로 HTTP 쿼리를 하는 예제를 모아 놓았다. 나름 도움이 된다.
* `firebase/cloud-functions/cron` 클라우드 함수를 크론 처럼 Scheduling 에서 특정 시간 주기 마다 실행.
* `firebase/cloud-funcitons/service-account-test` Service account 를 JSON 으로 저장 후, JSON import 해서 초기화
* `firebase/get_users` 공개 키로 Firestore 의 `users` 컬렉션에 있는 데이터를 가져오는 예. 특히 Firebase 로 작성된 앱의 경우, users 컬렉션에 security rules 가 없는 경우, 대부분 이 코드를 사용자 정보를 추출 할 수 있다.
* `firebase/firebase-json-download` Service Account 키를 통해서 Firestore 데이터를 다운로드하는 예제.

# Test

