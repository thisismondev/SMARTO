import 'dart:convert';
import 'package:http/http.dart' as http;

import '../config/env.dart';
import '../storage/token_storage.dart';

class ApiClient {
  static Future<Map<String, dynamic>> get(String endpoint) async {
    final token = await TokenStorage.getToken();

    final response = await http.get(
      Uri.parse("${Env.apiBaseUrl}$endpoint"),
      headers: {
        "Content-Type": "application/json",
        if (token != null) "Authorization": "Bearer $token",
      },
    );

    return _handleResponse(response);
  }

  static Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    final token = await TokenStorage.getToken();

    final response = await http.post(
      Uri.parse("${Env.apiBaseUrl}$endpoint"),
      headers: {
        "Content-Type": "application/json",
        if (token != null) "Authorization": "Bearer $token",
      },
      body: jsonEncode(body),
    );

    return _handleResponse(response);
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    final data = jsonDecode(response.body);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data;
    }

    throw Exception(data["message"] ?? "Terjadi kesalahan server");
  }
}
