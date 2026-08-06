import 'package:flutter/material.dart';

import '../../../core/storage/token_storage.dart';
import '../../../core/utils/error_parser.dart';

class AccountController extends ChangeNotifier {
  bool loading = false;
  String? error;

  int? userId;
  String? username;
  String? email;
  int? roleId;
  String? role;
  String? name;

  Future<void> loadAccount() async {
    try {
      loading = true;
      error = null;
      notifyListeners();

      userId = await TokenStorage.getUserId();
      username = await TokenStorage.getUsername();
      email = await TokenStorage.getEmail();
      roleId = await TokenStorage.getRoleId();
      role = await TokenStorage.getRole();
      name = await TokenStorage.getName();
    } catch (e) {
      error = parseError(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> refreshAccount() async {
    await loadAccount();
  }

  Future<void> clearAccount() async {
    try {
      loading = true;
      error = null;
      notifyListeners();

      await TokenStorage.removeUser();

      userId = null;
      name = null;
      username = null;
      email = null;
      roleId = null;
      role = null;
    } catch (e) {
      error = parseError(e);
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  bool get hasAccount {
    return userId != null;
  }

  String get displayName {
    return name == null || name!.isEmpty ? '-' : name!;
  }

  String get displayUsername {
    return username == null || username!.isEmpty ? '-' : username!;
  }

  String get displayEmail {
    return email == null || email!.isEmpty ? '-' : email!;
  }

  String get displayRole {
    return role == null || role!.isEmpty ? '-' : role!;
  }

  String get displayUserId {
    return userId == null ? '-' : userId.toString();
  }

  String get displayRoleId {
    return roleId == null ? '-' : roleId.toString();
  }
}