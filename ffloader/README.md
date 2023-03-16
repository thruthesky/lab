# FFLoader

## How to install flutterflow cli
dart pub global activate flutterflow_cli


## How to download code

- Run the `ffloader.sh` like below.

```sh 
ffloader.sh [key-file] [project-id]
```

- `key-file` is the file that has the FlutterFlow API Key.
- `project-id` is the FlutterFlow project id.


- example

```sh
./ffloader.sh ../keys/fireflow-api-key phi-lov-w6liu7
./ffloader.sh ../keys/fireflow-api-key hype-talk-tog63b
```

The `key-file.txt` is the file that has the FlutterFlow API key like below.

```txt
6afj808aa8-3141-a432-dsaf324114223
```


## How to run simulator

- Run in iOS Simulator. The device id is `8E7C4276-1F64-453C-AE32-422C59170B93`.

```sh
cd ./apps/xxx/xxx
flutter run -d 8E7C4276-1F64-453C-AE32-422C59170B93 --pid-file=../../../flutter.pid
```

- Run in Chrome browser.

```sh
cd ./apps/xxx/xxx
flutter run -d chrome --pid-file=../../../flutter.pid
```

- Run on iPhone11MaxPro (real device)

```sh
flutter run -d 00008030-000904C80290802E --pid-file=../../../flutter.pid
```
