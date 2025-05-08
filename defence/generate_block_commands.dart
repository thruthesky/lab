import 'ip_lib.dart'; // Import the library

/**
 * 구글 문서: https://docs.google.com/document/d/1Ljw6b2Hiq7d43gGD-7dP_iEKhGGyCVh7zviEs4vwg4Y/edit?tab=t.0#heading=h.vnv2wsamhklp 참고
 * 리눅스에서 Firewall-CMD 명령어로 불량한 IP 주소 차단을 위한, IP 주소 및 서브넷 차단 스크립트입니다.
 * IP 주소는 점(.)으로 구분하여 4개의 숫자로 구성됩니다.
 * 이 숫사 형식을 A.B.C.D 라고 표현을 하며,
 * 처음 A 와 B 두 개의 숫자를 그룹하는 B 클래스라고 하겠습니다. 예를 들면, 1.2.x.x 의 경우 B 클래스입니다. 이 때 x 는 0~255 까지의 숫자입니다.
 * 처음 A, B, C 세 개의 수자 그룹을 C 클래스라고 하겠습니다. 예를 들면, 1.2.3.x 의 경우 C 클래스입니다. 이 때 x 는 0~255 까지의 숫자입니다.
 * 
 * 이 스크립트가 IP 주소를 분석하여 C 클래스 단위에서 중복되는 IP 주소를 찾아서 `print("firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$subnet.0/24' reject\"",);`와 같이 차단할 수 있는 명령어를 화면에 출력합니다.
 * 만약, 맨 앞의 A.B.x.x 부분과 같이 IP 주소의 B 클래스가 2 개 이상 중복이 존재하면, B 클래스 단위로 차단을 하도록 합니다. 만약, 중복이 없는 IP 주소와 C 클래스에서, 앞의 A.B.x.x 와 같이 중복이 된다면, B 클래스 단위로 변경 해 주세요. B 클래스 단위는 `print("firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$subnet.0.0/16' reject\"");` 와 같이 화면에 출력합니다.
 * 만약, IP 주소가 C 클래스 또는 B 클래스에서 중복되는 것이 없다면, `print("firewall-cmd --permanent --add-rich-rule='rule family=\"ipv4\" source address=$ip reject'");` 와 같이 IP 단위로 차단을 하도록 합니다.
 * 
 * 예를 들어, 아래와 같은 IP 주소 목록이 `ips` 변수에 저장되어 있다고 가정합니다.
 * 
 * 1.2.3.4
 * 1.2.3.5
 * 2.3.4.5
 * 2.3.8.9
 * 2.3.9.9
 * 8.8.8.8
 * 3.4.5.6
 * 3.4.5.7
 * 3.4.8.8
 * 
 * 와 같은 경우,
 * `1.2.3.4` 와 `1.2.3.5` 두개의 클래스가 1.2.3.x 와 같이 C 클래스에서 2개가 중복이 되므로, `print("firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$subnet.0/24' reject\"",);` 와 같이 차단을 하도록 합니다.
 * `2.3.4.5`, `2.3.8.9`, `2.3.9.9` 와 같은 경우, C 클래스에서 중복되는 것이 없지만, `2.3.x.x` 와 같이 B 클래스에서 이 세개가 모두 중복되므로 `print("firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$subnet.0.0/16' reject\"");` 와 같이 차단을 하도록 합니다.
 * `8.8.8.8` 의 경우, C 클래스나 B 클래스에서 중복이 없기 때문에 IP 단위로 차단을 합니다.
 * `3.4.5.6` 과 `3.4.5.7` 은 C 클래스에서 중복되어 3.4.5.0 으로 서브넷을 구성합니다. 그리고 `3.4.8.8.` 은 `3.4.5.0` 과 C 클래스에서 중복되지는 않지만, B 클래스에서 중복됩니다. 그래서 두 둘을 `3.4.0.0` 과 같이 B 클래스로 묶어서 서브넷을 구성하여 차단 명령어를 출력합니다.
 * 
 * 명령어 출력 순서:
 * - B 클래스 단위 차단이 먼저 출력
 * - C 클래스 단위 차단이 그 다음에 출력
 * - 개별 IP 단위 차단이 마지막에 출력
 * 
 * 최악의 경우:
 * - B 단위로 차단 함. IP 주소의 A.B.x.x 부분이 2개 이상 중복이 존재하면, B 클래스 단위로 차단을 한다.
 */
void main() {
  String ips = '''
222.239.104.183
222.239.104.198
222.239.104.99
'''; // Example IPs from the problem description

  // IP 주소를 라인 별로 분리하고, 빈 라인을 제거하고, 중복을 제거한 후 정렬합니다.
  // 이 부분은 generateBlockCommands 함수 내부로 이동했습니다.
  List<String> ipList =
      ips.split('\n').where((element) => element.isNotEmpty).toSet().toList();
  ipList.sort();

  print("전체 IP 주소 (고유, 정렬): ${ipList.length}");

  List<String> firewallCommands = generateBlockCommands(ips);

  // Print all generated firewall commands
  for (String command in firewallCommands) {
    print(command);
  }

  // Print the reload command
  if (firewallCommands.isNotEmpty) {
    print("firewall-cmd --reload");
  } else {
    print("차단할 IP가 없습니다.");
  }
}
