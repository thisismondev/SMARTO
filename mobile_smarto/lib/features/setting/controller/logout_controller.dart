import 'package:flutter/material.dart';

import '../../../core/errors/app_exception.dart';
import '../../../core/storage/token_storage.dart';
import '../../../core/utils/error_parser.dart';
import '../../auth/data/auth_api.dart';

class LogoutController extends ChangeNotifier {
  bool loading = false;
  bool sessionExpired = false;
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
      if (e is TokenExpiredException) {
        sessionExpired = true;
        notifyListeners();
      }
      error = parseError(e);
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}