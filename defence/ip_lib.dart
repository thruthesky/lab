List<String> generateBlockCommands(String ipsInput) {
  // IP 주소를 라인 별로 분리하고, 빈 라인을 제거하고, 중복을 제거한 후 정렬합니다.
  List<String> ipList = ipsInput
      .split('\n')
      .where((element) =>
          element.isNotEmpty &&
          element.split('.').length == 4 &&
          element.split('.').every((part) => int.tryParse(part) != null))
      .toSet()
      .toList();
  ipList.sort();

  // C 클래스 단위를 기준으로 IP 주소를 그룹화합니다.
  // Key: "A.B.C", Value: List of IPs "A.B.C.D"
  Map<String, List<String>> cClassMap = {};
  // B 클래스 단위를 기준으로 IP 주소를 그룹화합니다.
  // Key: "A.B", Value: List of IPs "A.B.C.D"
  Map<String, List<String>> bClassMap = {};

  // IP 주소를 C 클래스와 B 클래스 단위로 그룹화합니다.
  for (String ip in ipList) {
    List<String> parts = ip.split('.');
    if (parts.length == 4 &&
        parts.every((part) => int.tryParse(part) != null)) {
      // IP 주소가 유효한 형식인지 확인합니다.
      String cPrefix = parts.sublist(0, 3).join('.');
      String bPrefix = parts.sublist(0, 2).join('.');

      cClassMap.putIfAbsent(cPrefix, () => []).add(ip);
      bClassMap.putIfAbsent(bPrefix, () => []).add(ip);
    }
  }

  Set<String> processedIPs = {};
  List<String> firewallCommands = [];

  // B 클래스 내에 얼마나 다양한 C 클래스 서브넷이 있는지 파악합니다.
  // Key: "A.B", Value: Set of "A.B.C"
  Map<String, Set<String>> bClassToUniqueCPrefixes = {};
  for (String ip in ipList) {
    List<String> parts = ip.split('.');
    if (parts.length == 4) {
      String bPrefix = parts.sublist(0, 2).join('.');
      String cPrefix = parts.sublist(0, 3).join('.');
      bClassToUniqueCPrefixes
          .putIfAbsent(bPrefix, () => Set<String>())
          .add(cPrefix);
    }
  }

  // 1. B 클래스 단위 차단 처리
  bClassToUniqueCPrefixes.forEach((bPrefix, uniqueCPrefixes) {
    if (uniqueCPrefixes.length >= 2) {
      firewallCommands.add(
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$bPrefix.0.0/16' reject\"",
      );
      if (bClassMap.containsKey(bPrefix)) {
        processedIPs.addAll(bClassMap[bPrefix]!);
      }
    }
  });

  // 2. C 클래스 단위 차단 처리
  cClassMap.forEach((cPrefix, ipsInCClass) {
    if (ipsInCClass.any((ip) => processedIPs.contains(ip))) {
      return;
    }

    if (ipsInCClass.length >= 2) {
      firewallCommands.add(
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$cPrefix.0/24' reject\"",
      );
      processedIPs.addAll(ipsInCClass);
    }
  });

  // 3. 개별 IP 단위 차단 처리
  for (String ip in ipList) {
    if (!processedIPs.contains(ip)) {
      firewallCommands.add(
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='$ip' reject\"",
      );
    }
  }
  return firewallCommands;
}
