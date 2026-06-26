import 'package:flutter/material.dart';

import '../../../core/storage/token_storage.dart';
import '../../auth/data/auth_api.dart';

class LogoutController extends ChangeNotifier {
  bool loading = false;
  String? error;

  Future<bool> logout() async {
    try {
      loading = true;
      error = null;
      notifyListeners();

      try {
        await AuthApi.logout();
      } catch (_) {
        // Jika logout ke server gagal,
        // token lokal tetap dihapus agar user tetap bisa keluar.
      }

      await TokenStorage.clearAuth();

      return true;
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}