import '../../../core/config/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../model/login_response_model.dart';

class AuthApi {
  static Future<LoginResponseModel> login({
    required String identifier,
    required String password,
  }) async {
    final response = await ApiClient.post(
      ApiEndpoints.login,
      {
        'identifier': identifier,
        'password': password,
      },
    );

    return LoginResponseModel.fromJson(response);
  }

  static Future<void> logout() async {
    await ApiClient.post(
      ApiEndpoints.logout,
      {},
    );
  }
}