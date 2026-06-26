import 'package:flutter/material.dart';

import '../../home/presentation/home_tab.dart';
import '../../sensor/presentation/sensor_tab.dart';
import '../../setting/presentation/setting_tab.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int selectedIndex = 0;

  final pages = const [
    HomeTab(),
    SensorTab(),
    SettingTab(),
  ];

  final titles = const [
    'Home',
    'Sensor',
    'Pengaturan',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F4),
      appBar: AppBar(
        title: Text(
          titles[selectedIndex],
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
      ),

      // IndexedStack menjaga state tiap tab
      body: IndexedStack(
        index: selectedIndex,
        children: pages,
      ),

      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedIndex,
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFE8F5E9),
        onDestinationSelected: (index) {
          setState(() {
            selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(
              Icons.home,
              color: Color(0xFF2E7D32),
            ),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(
              Icons.analytics,
              color: Color(0xFF2E7D32),
            ),
            label: 'Sensor',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(
              Icons.settings,
              color: Color(0xFF2E7D32),
            ),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}