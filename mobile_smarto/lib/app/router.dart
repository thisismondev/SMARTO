import 'package:flutter/material.dart';

import '../features/main/presentation/splashscreen_page.dart';
import '../features/auth/presentation/login_page.dart';
import '../features/main/presentation/main_page.dart';

class AppRouter {
  static const String splashScreen = '/';
  static const String login = '/login';
  static const String home = '/home';

  static Map<String, WidgetBuilder> routes = {
    splashScreen: (context) => const SplashScreenPage(),
    login: (context) => const LoginPage(),
    home: (context) => const MainPage(),
  };
}
