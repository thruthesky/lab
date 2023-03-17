project=$1
keys=("../keys/flutterflow.0.key" "../keys/flutterflow.1.key" "../keys/flutterflow.2.key")

while true
do
    for file in "${keys[@]}"; do
        key=`cat $file`
        now=`date`
        echo "Downloading at: $now / key: $key"
        SECONDS=0
        flutterflow export-code --project $project --dest ./apps/$project --include-assets --token $key
        duration=$SECONDS
        echo "--> Downloaded in $(($duration / 60)) minutes and $(($duration % 60)) seconds."
        kill -USR2 $(cat ./flutter.pid)
        sleep 40
    done
done

