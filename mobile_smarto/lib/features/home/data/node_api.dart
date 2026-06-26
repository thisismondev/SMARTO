import '../../../core/network/api_client.dart';
import '../model/node_response_model.dart';

import 'dart:developer';

class NodeApi {
  static Future<List<NodeResponseModel>> getMyNodes({
    required int userId,
  }) async {
    final response = await ApiClient.get('/api/mobile/node/$userId');

    final data = response['data'];

    log("Response: $response", name: "NodeApi.getMyNodes");
    log("Data: $data", name: "NodeApi.getMyNodes");

    if (data == null || data is! List) {
      return [];
    }

    return data.map((item) {
      return NodeResponseModel.fromJson(item);
    }).toList();
  }
}