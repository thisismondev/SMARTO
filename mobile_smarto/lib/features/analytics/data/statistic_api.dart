import 'dart:developer';
import '../../../core/config/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../model/statistic_response_model.dart';

class StatisticApi {
  static Future<List<StatisticModel>> getSensorStatistics({
    required int kodeNodeId,
    required String periode,
  }) async {
    try {
      final String url = ApiEndpoints.statistics(
        kodeNodeId: kodeNodeId,
        periode: periode,
      );

      final response = await ApiClient.get(url);
      
      log("Response: $response", name: "StatisticApi.getSensorStatistics");

      final data = response['data'];

      if (data == null || data is! List) {
        return [];
      }

      return data.map((item) => StatisticModel.fromJson(item)).toList();
    } catch (e, stacktrace) {
      log("Error fetching statistics: $e",
          name: "StatisticApi.getSensorStatistics",
          error: e,
          stackTrace: stacktrace);
      rethrow;
    }
  }
}