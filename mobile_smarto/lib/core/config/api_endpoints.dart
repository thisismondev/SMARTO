class ApiEndpoints {
  ApiEndpoints._();

  static const String login = '/api/mobile/auth/login';
  static const String logout = '/api/auth/logout';
  static String nodes(int userId) => '/api/mobile/node/$userId';
  static const String fuzzyEngine = '/api/fuzzy/engine';
  static String statistics({required int kodeNodeId, required String periode}) =>
      '/api/sensor/statistics?kodeNodeId=$kodeNodeId&periode=$periode';
}
