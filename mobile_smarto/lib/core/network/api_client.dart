import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../config/env.dart';
import '../errors/app_exception.dart';
import '../storage/token_storage.dart';

class ApiClient {
  static const _timeout = Duration(seconds: 15);

  static Future<Map<String, dynamic>> get(String endpoint) async {
    final token = await TokenStorage.getToken();

    final response = await http
        .get(
          Uri.parse("${Env.apiBaseUrl}$endpoint"),
          headers: {
            "Content-Type": "application/json",
            if (token != null) "Authorization": "Bearer $token",
          },
        )
        .timeout(_timeout, onTimeout: () => throw const TimeoutException());

    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    final token = await TokenStorage.getToken();

    final response = await http
        .post(
          Uri.parse("${Env.apiBaseUrl}$endpoint"),
          headers: {
            "Content-Type": "application/json",
            if (token != null) "Authorization": "Bearer $token",
          },
          body: jsonEncode(body),
        )
        .timeout(_timeout, onTimeout: () => throw const TimeoutException());

    return _handleResponse(response);
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode == 401) {
      TokenStorage.clearAuth();
      throw const TokenExpiredException();
    }

    Map<String, dynamic> data;
    try {
      data = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      throw ServerException(
        'Respons server tidak valid (HTTP ${response.statusCode})',
        statusCode: response.statusCode,
      );
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    }

    throw ServerException(
      data["message"] ?? "Terjadi kesalahan server",
      statusCode: response.statusCode,
    );
  }
}
