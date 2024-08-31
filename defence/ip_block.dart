void main() {
  String ips = '''
141.98.84.50
141.98.84.53
158.62.17.242
185.102.113.157
185.102.113.189
185.102.113.62
185.96.37.124
185.96.37.174
185.96.37.63
213.108.0.62
213.108.3.161
45.10.164.108
45.10.164.157
45.10.167.111
45.10.167.163
50.114.35.22
5.181.169.253
57.141.3.18
57.141.3.25
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
