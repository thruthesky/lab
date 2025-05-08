import 'package:test/test.dart';
import 'ip_lib.dart'; // Adjust path as necessary

void main() {
  group('generateBlockCommands Tests', () {
    test('Example from problem description', () {
      String ips = '''
1.2.3.4
1.2.3.5
2.3.4.5
2.3.8.9
2.3.9.9
8.8.8.8
3.4.5.6
3.4.5.7
3.4.8.8
''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='2.3.0.0/16' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='3.4.0.0/16' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='1.2.3.0/24' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='8.8.8.8' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      actualCommands.sort(); // Sort for consistent comparison
      expectedCommands.sort();
      expect(actualCommands, equals(expectedCommands));
    });

    test('(2) C-Classes goes to 1 B class blocking', () {
      String ips = '''
10.0.0.1
10.0.0.2
10.0.1.1
10.0.1.2
''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='10.0.0.0/16' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      actualCommands.sort();
      expectedCommands.sort();
      expect(actualCommands, equals(expectedCommands));
    });

    test('B-Class blocking due to diverse C-Classes', () {
      String ips = '''
20.20.1.1
20.20.2.2
20.20.3.3 
'''; // Three distinct C-classes within the same B-class
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='20.20.0.0/16' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      expect(actualCommands, equals(expectedCommands));
    });

    test('Individual IP blocking', () {
      String ips = '''
192.168.1.1
172.16.0.1
''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='172.16.0.1' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='192.168.1.1' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      actualCommands.sort();
      expectedCommands.sort();
      expect(actualCommands, equals(expectedCommands));
    });

    test('Mixed C-Class and Individual IP', () {
      String ips = '''
50.50.50.1
50.50.50.2
50.50.51.1
''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='50.50.0.0/16' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      actualCommands.sort();
      expectedCommands.sort();
      expect(actualCommands, equals(expectedCommands));
    });

    test('B-Class blocking takes precedence over C-Class', () {
      String ips = '''
77.77.1.1
77.77.1.2 
77.77.2.1 
''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='77.77.0.0/16' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      expect(actualCommands, equals(expectedCommands));
    });

    test('Empty input', () {
      String ips = '';
      List<String> expectedCommands = [];
      List<String> actualCommands = generateBlockCommands(ips);
      expect(actualCommands, equals(expectedCommands));
    });

    test('Single IP input', () {
      String ips = '1.1.1.1';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='1.1.1.1' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      expect(actualCommands, equals(expectedCommands));
    });

    test('Duplicate IPs in input', () {
      String ips = '''
1.2.3.4
1.2.3.4
1.2.3.5
''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='1.2.3.0/24' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      expect(actualCommands, equals(expectedCommands));
    });

    test('복잡한 테스트', () {
      String ips = '''
; C 단위 블럭: 1.2.3.0/24
1.2.3.4
1.2.3.5
1.2.3.6

; D 단위 블럭: 1.9.9.9 단일 IP 블럭
1.9.9.9

; B 단위 블럭: 2.2.0.0/16
2.2.2.2
2.2.3.3

; C 단위 블럭
3.3.3.3
3.3.3.4

; B 단위 블럭:
4.4.1.1
4.4.2.2

; B 단위 블럭
5.5.5.5
5.5.6.5
5.5.6.6
5.5.7.7
5.5.8.8
5.5.9.9

; C 단위 블럭
6.6.6.6
6.6.6.60
6.6.6.166

; C 단위 블럭
100.200.0.123
100.200.0.124


; D 단위 블럭
100.201.0.125


''';
      List<String> expectedCommands = [
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='2.2.0.0/16' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='4.4.0.0/16' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='5.5.0.0/16' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='1.2.3.0/24' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='100.200.0.0/24' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='3.3.3.0/24' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='6.6.6.0/24' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='1.9.9.9' reject\"",
        "firewall-cmd --permanent --add-rich-rule=\"rule family='ipv4' source address='100.201.0.125' reject\"",
      ];
      List<String> actualCommands = generateBlockCommands(ips);
      expect(actualCommands, equals(expectedCommands));
    });
  });
}
