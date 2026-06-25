import 'package:flutter/material.dart';

import '../../../core/storage/token_storage.dart';
import '../data/auth_api.dart';

class AuthController extends ChangeNotifier {
  bool loading = false;
  String? error;

  Future<bool> login({
    required String identifier,
    required String password,
  }) async {
    if (identifier.trim().isEmpty || password.trim().isEmpty) {
      error = 'Email / Username dan password wajib diisi';
      notifyListeners();
      return false;
    }

    try {
      loading = true;
      error = null;
      notifyListeners();

      final result = await AuthApi.login(
        identifier: identifier.trim(),
        password: password.trim(),
      );

      await TokenStorage.saveToken(result.token);

      return true;
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  // Future<void> getProfile() async {
  //   try {
  //     loading = true;
  //     error = null;
  //     notifyListeners();

  //     user = await AuthApi.getProfile();
  //   } catch (e) {
  //     error = e.toString().replaceAll('Exception: ', '');
  //   } finally {
  //     loading = false;
  //     notifyListeners();
  //   }
  // }

  Future<void> logout() async {
    try {
      await AuthApi.logout();
    } catch (_) {
      // abaikan error logout dari server
    }

    await TokenStorage.removeToken();
    notifyListeners();
  }
}