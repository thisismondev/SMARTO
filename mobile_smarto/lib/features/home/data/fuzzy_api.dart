import '../../../core/network/api_client.dart';
import '../model/fuzzy_response_model.dart';

import 'dart:developer';

class FuzzyApi {
  static Future<FuzzyData> fuzzyEngine({
      required double ph,
      required double kelembapan,
      required double suhu,
      required int nitrogen,
  }) async {
    final response = await ApiClient.post('/api/fuzzy/engine', {
      'ph': ph,
      'kelembapan': kelembapan,
      'suhu': suhu,
      'nitrogen': nitrogen,
    });

    final data = response['data'];

    log("Response: $response", name: "FuzzyApi.fuzzyEngine");
    log("Data: $data", name: "FuzzyApi.fuzzyEngine");

    if (data == null || data is! Map<String, dynamic>) {
      throw Exception('Invalid response data');
    }

    return FuzzyData.fromJson(data);

  }
}