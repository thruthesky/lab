void main() {
  String ips = '''
154.54.249.211
173.255.175.121
217.113.194.162
217.113.194.163
217.113.194.164
217.113.194.165
217.113.194.166
217.113.194.167
217.113.194.168
217.113.194.169
217.113.194.170
217.113.194.171
217.113.194.250
220.83.220.128
130.105.183.101
158.62.49.209
175.176.10.176
176.135.108.47
220.83.220.128
66.220.149.54
58.69.4.30
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
