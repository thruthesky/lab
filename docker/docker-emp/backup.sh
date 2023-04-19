#!/bin/sh

# DB 접속 정보
dbname='sonub'
user='sonub'
password='-------'

# 백업 폴더
folder='/home/sonub/backup'

# 백업을 해서 저장 할 파일 명. 크론 명령행 또는 CLI 에서 파라메타로 전달.
filename=$1

# 동일한 이름으로 백업 파일이 존재하면 지운다. 없으면 말고.
rm ${folder}/${filename}.sql.gz > /dev/null 2>&1

# Mysql backup. Put proper database name, password.
docker exec www_docker_mariadb mysqldump -u${user} -p${password} ${dbname} --single-transaction --quick --lock-tables=false > ${folder}/${filename}.sql

# 압축한다.
gzip ${folder}/${filename}.sql

