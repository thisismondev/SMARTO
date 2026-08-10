import '../../../core/config/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../model/node_response_model.dart';

import 'dart:developer';

class NodeApi {
  static Future<List<NodeResponseModel>> getMyNodes({
    required int userId,
  }) async {
    final response = await ApiClient.get(ApiEndpoints.nodes(userId));

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

  static Future<bool> checkKodeNode(String kodeNode) async {
    await ApiClient.get(ApiEndpoints.checkKodeNode(kodeNode));

    log("Kode node $kodeNode tersedia", name: "NodeApi.checkKodeNode");

    return true;
  }

  static Future<void> addNode({
    required String kodeNode,
    required String label,
    required String lat,
    required String lng,
  }) async {
    await ApiClient.post(ApiEndpoints.addNode, {
      'kodeNode': kodeNode,
      'label': label,
      'lat': lat,
      'lng': lng,
    });

    log(
      "Node $kodeNode berhasil ditambahkan",
      name: "NodeApi.addNode",
    );
  }
}