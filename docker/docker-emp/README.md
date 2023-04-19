# 도커 + Nginx + PHP:8 + MariaDB:latest


## 설치

- 먼저 도커를 설치한다.
  
- 우분투 서버 기준으로 루트 계정으로 아래와 같이 실행한다.
  `# git clone https://github.com/thruthesky/docker /docker`
  
  만약, 개발을 위해서 설치한다면, 적절한 폴더에 설치하면 된다.


- 아래의 폴더를 생성한다.
  `mkdir etc/nginx/logs`
  
- `docker-compose up` 이라고 명령하면 실행이 된다.
  - 서버에서는 `docker-compose up -d` 와 같이 해서 백그라운드로 실행하면 된다.

- `/docker/home` 폴더에는 `/docker/home/default` 폴더가 있는데, phpMyAdmin 이 여기에 설치되어져 있다.
  - 참고로 `/docker/home` 폴더는 .gitignore 에 추가되어져 있어,
    `/docker/home` 폴더 아래는 이 docker 프로젝트(git repo)에 영향을 받지 않는다.
    즉, `/docker/home` 폴더 아래에서는 다른 Github 의 프로젝트를 clone 을 해도 상관 없다.
    
- 실행 후 `http://127.0.0.1/etc/phpMyAdmin/index.php` 와 같이 phpMyAdmin 에 접속 할 수 있으며 적절한 도메인으로 변경하면 된다.
  
- `docker-compose up` 을 실행하면 최초 1회, MariaDB 설정이 이루어진다. 자세한 것은 docker-compose.yml 파일을 참고한다.
- 각 사용자의 홈 폴더가 `/docker/home/***` 와 같이 최 상위 `/docker` 폴더 아래에 home 폴더가 있다.
  이렇게 해야하는 이유는 `/docker` 폴더가 Host OS 와 공유되므로, 개발 작업을 할 때 보다 편하게 작업을 할 수 있다.
  
- 사용자 계정 생성
  예를 들어 `centerx` 라는 사용자 계정을 생설하려면, 아래와 같이 하면 된다.
```shell
useradd -m -d /docker/home/centerx centerx
```




## MariaDB 백업

- 백업 스크립트 `backup.sh` 를 열어서, DB 접속 정보와 백업 저장할 폴더를 지정한다.
- 백업 스크립트 `backup.sh abc` 와 같이 실행하면, DB 를 백업해서 지정된 폴더에 abc.sql.gz 로 보관한다.
- 백업 스크립트를 아래와 같이 크론으로 등록한다.

```text
## 매일 새벽 1시에 백업. 1주일 단위로 백업 파일이 갱신된다. 즉, 1주일 전의 데이터는 날라간다.
00 1 * * 0 /docker/backup.sh sunday
00 1 * * 1 /docker/backup.sh monday
00 1 * * 2 /docker/backup.sh tuesday
00 1 * * 3 /docker/backup.sh wednesday
00 1 * * 4 /docker/backup.sh thursday
00 1 * * 5 /docker/backup.sh friday
00 1 * * 6 /docker/backup.sh saturday


## 월 2 회, 매월 1일, 16일 낮 12시에 백업을 한다. 즉, 한달에 2번, 1년에 24번 백업을 한다.
## jan.sql.gz 는 1일, jan16.sql.gz 는 16일.

00 12 1 1 * /docker/backup.sh jan
00 12 1 2 * /docker/backup.sh feb
00 12 1 3 * /docker/backup.sh mar
00 12 1 4 * /docker/backup.sh apr
00 12 1 5 * /docker/backup.sh may
00 12 1 6 * /docker/backup.sh jun
00 12 1 7 * /docker/backup.sh jul
00 12 1 8 * /docker/backup.sh aug
00 12 1 9 * /docker/backup.sh sep
00 12 1 10 * /docker/backup.sh oct
00 12 1 11 * /docker/backup.sh nov
00 12 1 12 * /docker/backup.sh dec

00 12 16 1 * /docker/backup.sh jan16
00 12 16 2 * /docker/backup.sh feb16
00 12 16 3 * /docker/backup.sh mar16
00 12 16 4 * /docker/backup.sh apr16
00 12 16 5 * /docker/backup.sh may16
00 12 16 6 * /docker/backup.sh jun16
00 12 16 7 * /docker/backup.sh jul16
00 12 16 8 * /docker/backup.sh aug16
00 12 16 9 * /docker/backup.sh sep16
00 12 16 10 * /docker/backup.sh oct16
00 12 16 11 * /docker/backup.sh nov16
00 12 16 12 * /docker/backup.sh dec16
```
