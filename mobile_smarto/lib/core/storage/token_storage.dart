import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static const String _tokenKey = 'token';

  static const String _userIdKey = 'user_id';
  static const String _usernameKey = 'username';
  static const String _emailKey = 'email';
  static const String _roleIdKey = 'role_id';
  static const String _roleKey = 'role';

  // =========================
  // TOKEN
  // =========================

  static Future<void> saveToken(String token) async {
    await _storage.write(
      key: _tokenKey,
      value: token,
    );
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  static Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> removeToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // =========================
  // USER DATA
  // =========================

  static Future<void> saveUser({
    required int id,
    required String username,
    required String email,
    required int roleId,
    required String role,
  }) async {
    await _storage.write(
      key: _userIdKey,
      value: id.toString(),
    );

    await _storage.write(
      key: _usernameKey,
      value: username,
    );

    await _storage.write(
      key: _emailKey,
      value: email,
    );

    await _storage.write(
      key: _roleIdKey,
      value: roleId.toString(),
    );

    await _storage.write(
      key: _roleKey,
      value: role,
    );
  }

  static Future<int?> getUserId() async {
    final value = await _storage.read(key: _userIdKey);

    if (value == null) return null;

    return int.tryParse(value);
  }

  static Future<String?> getUsername() async {
    return await _storage.read(key: _usernameKey);
  }

  static Future<String?> getEmail() async {
    return await _storage.read(key: _emailKey);
  }

  static Future<int?> getRoleId() async {
    final value = await _storage.read(key: _roleIdKey);

    if (value == null) return null;

    return int.tryParse(value);
  }

  static Future<String?> getRole() async {
    return await _storage.read(key: _roleKey);
  }

  static Future<bool> hasUser() async {
    final userId = await getUserId();
    return userId != null;
  }

  static Future<void> removeUser() async {
    await _storage.delete(key: _userIdKey);
    await _storage.delete(key: _usernameKey);
    await _storage.delete(key: _emailKey);
    await _storage.delete(key: _roleIdKey);
    await _storage.delete(key: _roleKey);
  }

  // =========================
  // AUTH CLEAR
  // =========================

  static Future<void> clearAuth() async {
    await removeToken();
    await removeUser();
  }

  static Future<void> clear() async {
    await _storage.deleteAll();
  }
}