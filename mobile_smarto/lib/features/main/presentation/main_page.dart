import 'package:flutter/material.dart';
import '../../home/presentation/home_tab.dart';
import '../../analytics/presentation/analytics_tab.dart';
import '../../setting/presentation/setting_tab.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int selectedIndex = 0;
  late final PageController _pageController;

  final pages = const [HomeTab(), AnalyticsTab(), SettingTab()];

  final titles = const ['Home', 'Analytics', 'Pengaturan'];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: selectedIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

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

      // Mengganti IndexedStack dengan PageView
      body: PageView(
        controller: _pageController,
        physics:
            const NeverScrollableScrollPhysics(), // Kunci geser layar (wajib geser lewat nav bar)
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
          // Pindah halaman dengan animasi halus atau instan (.jumpToPage)
          _pageController.animateToPage(
            index,
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeInOut,
          );
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: Color(0xFF2E7D32)),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(Icons.analytics, color: Color(0xFF2E7D32)),
            label: 'Analytics',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings, color: Color(0xFF2E7D32)),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
