void main() {
  String ips = '''
152.32.104.164
185.102.112.230
185.102.112.28
185.102.112.64
185.102.112.83
185.102.112.86
185.102.113.157
185.61.216.241
185.61.216.50
194.104.8.105
213.108.0.53
45.10.164.108
45.10.164.212
45.10.164.34
45.10.167.111
45.10.167.163
50.114.35.22
57.141.3.1
57.141.3.18
66.220.149.41
66.220.149.47
77.220.192.153
77.220.192.53
77.220.195.213
77.220.195.39
85.215.154.178
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
