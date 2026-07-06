import 'dart:developer';
import '../../../core/network/api_client.dart'; // Sesuaikan dengan path ApiClient Anda
import '../model/statistic_response_model.dart';

class StatisticApi {
  /// Mengambil data statistik sensor berdasarkan kodeNodeId, jenis parameter, dan periode waktu
  static Future<List<StatisticModel>> getSensorStatistics({
    required int kodeNodeId,
    required String periode,   // Nilai: 'day', 'month', atau 'year'
  }) async {
    try {
      // Menyusun URL beserta Query Parameters: api/sensor/statistics?kodeNodeId=X&periode=Y&type=Z
      final String url = '/api/sensor/statistics'
          '?kodeNodeId=$kodeNodeId'
          '&periode=$periode';

      final response = await ApiClient.get(url);
      
      log("Response: $response", name: "StatisticApi.getSensorStatistics");

      // Mengambil array data di dalam response (menyesuaikan struktur response ApiClient Anda)
      final data = response['data'];

      if (data == null || data is! List) {
        return [];
      }

      // Mapping list JSON menjadi List Object Model
      return data.map((item) => StatisticModel.fromJson(item)).toList();
    } catch (e, stacktrace) {
      log("Error fetching statistics: $e", 
          name: "StatisticApi.getSensorStatistics", 
          error: e, 
          stackTrace: stacktrace);
      rethrow; // Teruskan error ke controller untuk ditangani di UI
    }
  }
}