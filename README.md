# Lab

* 개발에 필요한 코드를 보관하는 것으로 실제 사용 할 수 있는 코드들이 많으므로 각 프로젝트(폴더)의 README 를 잘 읽어 보고 사용하면 된다.
* 본 repo 는 공개되는 repo 이다. 그래서 키 관리를 잘 해야 한다.
  * 모든 키는 반드시 `keys` (또는 `key`) 폴더 아래에 보관해야 한다. `keys` 폴더는 .gitignore 에 등록되어 git repo 에 저장되지 않는다.
    예를 들면, 키를 .ts 파일에 보관 할 때에는 `./abc/keys/api-key.ts` 와 같이 하면 된다.
* 그리고, 쓸데 없는 (용량이 큰) 코드가 git repo 에 올라가지 않도록 잘 관리 해야 한다.


# 중요한 코드 목록


* `authentication/nice-id-pass-login` 나이스 본인 인증 - NICE PASS 본인 확인 - 해당 README 파일 참고
* `ffloader` FlutterFlow auto loader
* `firebase/cloud-functions` 파이어베이스 클라우드 함수 관련 코드. 이 폴더에 중요한 코드들이 많다. 특히, 곧바로 사용가능한 코드들이 있으므로 꼭 README 를 참고한다.
* `firebase/get_users` 파이어베이스의 접속 키로 다른 파이어베이스의 정보 긁어 오기
* `http-client`

# Test

