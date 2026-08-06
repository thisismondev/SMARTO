import 'package:flutter/material.dart';

import '../../../core/errors/app_exception.dart';
import '../../../core/storage/token_storage.dart';
import '../../../core/utils/error_parser.dart';
import '../data/auth_api.dart';

class AuthController extends ChangeNotifier {
  bool loading = false;
  bool sessionExpired = false;
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

      await TokenStorage.saveUser(
        id: result.user.id,
        name: result.user.name,
        username: result.user.username,
        email: result.user.email,
        roleId: result.user.roleId,
        role: result.user.role,
      );

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
