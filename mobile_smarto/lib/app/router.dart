import 'package:flutter/material.dart';

import '../features/auth/presentation/splashscreen_page.dart';
import '../features/auth/presentation/login_page.dart';
import '../features/home/presentation/home_page.dart';
import '../features/profile/presentation/profile_page.dart';

class AppRouter {
  static const String splashScreen = '/';
  static const String login = '/login';
  static const String home = '/home';
  static const String profile = '/profile';

  static Map<String, WidgetBuilder> routes = {
    splashScreen: (context) => const SplashScreenPage(),
    login: (context) => const LoginPage(),
    home: (context) => const HomePage(),
    profile: (context) => const ProfilePage(),
  };
}
