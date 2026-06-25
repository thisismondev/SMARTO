import 'package:flutter/material.dart';

import 'router.dart';
import 'theme.dart';

class SmartoApp extends StatelessWidget {
  const SmartoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SMARTO',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: AppRouter.splashScreen,
      routes: AppRouter.routes,
    );
  }
}
