#!/bin/bash



echo "* ------ FlutterFlow Hot Reloader -----"
echo "*"
echo "* Project ID: $2"
echo "* Enter to reload."
echo "*"


echo "Downloading with assets ..."
SECONDS=0
flutterflow export-code --project $2 --dest ./apps/$2 --include-assets --token $1
duration=$SECONDS
echo "--> Downloaded in $(($duration / 60)) minutes and $(($duration % 60)) seconds."

while true
do
  now=`date`
  echo "--> $now Done. Enter to reload again."
  read key
  echo "--> Downloading without assets..."
  SECONDS=0
  flutterflow export-code --project $2 --dest ./apps/$2 --no-include-assets --token $1
  echo "--> Downloaded in $(($duration / 60)) minutes and $(($duration % 60)) seconds."
  kill -USR2 $(cat ./flutter.pid)
done


