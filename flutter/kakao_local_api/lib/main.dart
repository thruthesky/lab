// 카카오 로컬 : https://developers.kakao.com/docs/latest/ko/local/dev-guide

// dependencies:
//   flutter:
//     sdk: flutter
//   cupertino_icons: ^1.0.2
//   provider: ^5.0.0-nullsafety.5
//   http: ^0.13.0-nullsafety.0
//   url_strategy: ^0.2.0-nullsafety.0

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

Future<void> main() async {
  return runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({
    super.key,
  });
  @override
  State<StatefulWidget> createState() => MyAppState();
}

class MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('카카오 로컬 API - 주소를 좌표로 변환'),
        ),
        body: Column(
          children: [
            TextButton(
                onPressed: () async {
                  String apiUrl =
                      "https://dapi.kakao.com/v2/local/search/address.json?query=경남 김해시 대성동 411-11";
                  final http.Response res = await http.get(
                    Uri.parse(apiUrl),
                    headers: {"Authorization": "KakaoAK 7c567f8e9e57ffa08531df5aa9efebb5"},
                  );

                  final Map<String, dynamic> result = json.decode(res.body);
                  print(result);
                },
                child: const Text("한글 주소로 좌표 가져오기")),
          ],
        ),
      ),
    );
  }
}

// class LocalProvider with ChangeNotifier {
//   static const String URL = "https://dapi.kakao.com/v2/local/search/address.json";
//   static const Map<String, String> HEADERS = {"Authorization": "KakaoAK REST_API_KEY"};

//   Map<String, dynamic>? _data;
//   Map<String, dynamic>? get data => _data;

//   set data(newData) {
//     _data = newData;
//     notifyListeners();
//   }

//   Future<void> search({required String searchData}) async {
//     final String data =
//         "?query=$searchData&page=1&size=10&analyze_type=similar"; // 기본 값 : page=1&size=10&analyze_type=similar
//     final http.Response res =
//         await http.get(Uri.parse(LocalProvider.URL + data), headers: LocalProvider.HEADERS);
//     final Map<String, dynamic> result = json.decode(res.body);
//     data = result;
//     return;
//   }
// }

// class Func2 extends StatefulWidget {
//   const Func2({super.key});

//   @override
//   _Func2State createState() => _Func2State();
// }

// class _Func2State extends State<Func2> {
//   TextEditingController? _ct;
//   @override
//   void initState() {
//     _ct = TextEditingController(text: "");
//     super.initState();
//   }

//   @override
//   void dispose() {
//     _ct?.dispose();
//     super.dispose();
//   }

//   LocalProvider? _localProvider;
//   @override
//   Widget build(BuildContext context) {
//     _localProvider = Provider.of<LocalProvider>(context);
//     return _ct == null
//         ? Container()
//         : Scaffold(
//             appBar: AppBar(
//               title: const Text("주소 및 좌표 검색 _ KakaO"),
//             ),
//             body: Center(
//               child: Container(
//                 padding: const EdgeInsets.all(20.0),
//                 child: TextField(
//                   controller: _ct,
//                 ),
//               ),
//             ),
//             floatingActionButton: FloatingActionButton(
//               child: const Icon(Icons.search),
//               onPressed: () async {
//                 await _localProvider!.search(searchData: _ct!.text);
//                 _ct!.text = "";
//                 await Navigator.of(context).push(MaterialPageRoute(
//                     settings: const RouteSettings(name: '/kakaoAddress'),
//                     builder: (BuildContext context) => const SearchPage()));
//                 return;
//               },
//             ),
//           );
//   }
// }

// class SearchPage extends StatelessWidget {
//   const SearchPage({super.key});

//   @override
//   Widget build(BuildContext context) {
//     LocalProvider local = Provider.of<LocalProvider>(context);
//     local.data ??= [];
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("검색 결과"),
//       ),
//       body: (local._data == null || local.data!.isEmpty)
//           ? Container()
//           : ListView.builder(
//               itemCount: int.parse(local.data!['meta']['total_count'].toString()),
//               itemBuilder: (BuildContext context, int index) => ListTile(
//                     title: Text(local.data!['documents'][index]['address_name'].toString()),
//                     subtitle: Text(
//                         "x: ${local.data!['documents'][index]['x'].toString()} , y: ${local.data!['documents'][index]['y'].toString()}"),
//                     onTap: () {},
//                   )),
//     );
//   }
// }
