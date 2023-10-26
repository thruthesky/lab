#!/bin/bash


key=`cat $1`
project_id=$2


echo "* ------ FlutterFlow Hot Reloader -----"
echo "*"
echo "* Project ID: $project_id"
echo "* Key: $key"
echo "*"


echo "Downloading with assets ..."
SECONDS=0
flutterflow export-code --project $project_id --dest . --include-assets --token $key
duration=$SECONDS
echo "--> Downloaded in $(($duration / 60)) minutes and $(($duration % 60)) seconds."

while true
do
  now=`date`
  echo "--> $now Done. Enter to reload again."
  read enterKey
  echo "--> Downloading without assets..."
  SECONDS=0
  flutterflow export-code --project $project_id --dest . --no-include-assets --token $key
  echo "--> Downloaded in $(($duration / 60)) minutes and $(($duration % 60)) seconds."
  kill -USR2 $(cat ./flutter.pid)
done


