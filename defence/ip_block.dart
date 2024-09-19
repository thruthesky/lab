void main() {
  String ips = '''
112.206.110.122
166.0.238.14
176.45.174.132
182.2.140.181
182.89.111.85
193.186.4.167
45.93.128.167
49.145.110.2
58.69.68.72
61.250.32.22
61.250.32.35
64.224.124.46
103.21.15.244
121.126.58.27
158.62.21.10
176.45.174.132
182.89.111.85
188.190.10.136
193.186.4.148
209.35.169.131
211.235.73.214
211.246.68.44
61.250.32.28
61.250.32.43
95.161.76.23
136.158.29.115
175.176.33.109
176.45.174.132
182.89.111.85
188.190.10.136
193.186.4.167
203.160.177.82
205.209.120.238
221.157.243.240
27.125.19.250
45.67.97.48
61.250.32.41
''';

  List<String> ipList = ips.split('\n');
  ipList.removeWhere((element) => element.isEmpty);
  ipList = ipList.toSet().toList();
  ipList.sort();
  for (String ip in ipList) {
    print(
        "firewall-cmd --permanent --add-rich-rule='rule family=\"ipv4\" source address=$ip reject'");
  }
  print("firewall-cmd --reload");
  print("length: " + ipList.length.toString());
}
