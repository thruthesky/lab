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
import 'package:kakao_local_api/keys.dart';

typedef Address = ({
  String admCd,
  String bdKdcd,
  String bdMgtSn,
  String bdNm,
  String buldMnnm,
  String buldSlno,
  String currentPage,
  String currentPerPage,
  String detBdNmList,
  String emdNm,
  String emdNo,
  String engAddr,
  String errorCode,
  String errorMessage,
  String hemdNm,
  String jibunAddr,
  String liNm,
  String lnbrMnnm,
  String lnbrSlno,
  String mtYn,
  String rn,
  String rnMgtSn,
  String roadAddr,
  String roadAddrPart1,
  String roadAddrPart2,
  String relJibun,
  String sggNm,
  String siNm,
  String hstryYn,
  String totalCount,
  String udrtYn,
  String zipNo,
});

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
  List<Address> address = [];
  parseAddress(Map<String, dynamic> re) {
    List<Address> address = [];

    for (int i = 0; i < int.parse(re['results']['common']['totalCount'].toString()); i++) {
      final common = re['results']['common'];
      final juso = re['results']['juso'][i];

      address.add((
        admCd: juso['admCd'] ?? '',
        bdKdcd: juso['bdKdcd'] ?? '',
        bdMgtSn: juso['bdMgtSn'] ?? '',
        bdNm: juso['bdNm'] ?? '',
        buldMnnm: juso['buldMnnm'] ?? '',
        buldSlno: juso['buldSlno'] ?? '',
        currentPage: common['currentPage'] ?? '',
        currentPerPage: common['currentPerPage'] ?? '',
        detBdNmList: juso['detBdNmList'] ?? '',
        emdNm: juso['emdNm'] ?? '',
        emdNo: juso['emdNo'] ?? '',
        engAddr: juso['engAddr'] ?? '',
        errorCode: common['errorCode'] ?? '',
        errorMessage: common['errorMessage'] ?? '',
        hemdNm: juso['hemdNm'] ?? '',
        jibunAddr: juso['jibunAddr'] ?? '',
        liNm: juso['liNm'] ?? '',
        lnbrMnnm: juso['lnbrMnnm'] ?? '',
        lnbrSlno: juso['lnbrSlno'] ?? '',
        mtYn: juso['mtYn'] ?? '',
        rn: juso['rn'] ?? '',
        rnMgtSn: juso['rnMgtSn'] ?? '',
        roadAddr: juso['roadAddr'] ?? '',
        roadAddrPart1: juso['roadAddrPart1'] ?? '',
        roadAddrPart2: juso['roadAddrPart2'] ?? '',
        relJibun: juso['relJibun'] ?? '',
        sggNm: juso['sggNm'] ?? '',
        siNm: juso['siNm'] ?? '',
        hstryYn: juso['hstryYn'] ?? '',
        totalCount: common['totalCount'] ?? '',
        udrtYn: juso['udrtYn'] ?? '',
        zipNo: juso['zipNo'] ?? '',
      ));
    }
    return address;
  }

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
                  headers: {"Authorization": "KakaoAK $KakaoKey"},
                );

                final Map<String, dynamic> result = json.decode(res.body);
                print(result);
              },
              child: const Text("한글 주소로 좌표 가져오기"),
            ),
            TextField(
              controller: TextEditingController(text: "부림아파트"),
              onSubmitted: (value) async {
                String queryUrl =
                    "https://business.juso.go.kr/addrlink/addrLinkApi.do?currentPage=1&countPerPage=200&keyword=$value&confmKey=U01TX0FVVEgyMDIzMTExODE5MjMzMDExNDI4ODc=&hstryYn=Y&resultType=json";
                final http.Response res = await http.get(
                  Uri.parse(queryUrl),
                );
                final Map<String, dynamic> result = json.decode(res.body);
                address = parseAddress(result);
                setState(() {});
              },
            ),
            Expanded(
              child: ListView.builder(
                itemCount: address.length,
                itemBuilder: (BuildContext context, int index) {
                  return ListTile(
                    title: Text(address[index].roadAddr),
                    subtitle: Text(address[index].roadAddrPart1),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
