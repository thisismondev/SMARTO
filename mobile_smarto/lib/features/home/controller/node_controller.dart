import 'package:flutter/material.dart';

import '../data/node_api.dart';
import '../model/node_response_model.dart';

import '../../../core/storage/token_storage.dart';

import 'dart:developer';

class NodeController extends ChangeNotifier {
  bool loadingLahan = false;
  bool loadingSensor = false;
  String? error;

  List<NodeResponseModel> lahanList = [];
  NodeResponseModel? selectedLahan;
  SensorReadingModel? sensorData;

  String? farmer;

  Future<void> fetchLahan() async {
    final userId = await TokenStorage.getUserId();
    final name = await TokenStorage.getName();
    try {
      loadingLahan = true;
      error = null;
      selectedLahan = null;
      sensorData = null;
      notifyListeners();

      lahanList = await NodeApi.getMyNodes(userId: userId ?? 0);

      log(
        "Fetched ${lahanList.length} lahan(s) for userId: $userId",
        name: "NodeController.fetchLahan",
      );
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
      log("Error fetching lahan: $error", name: "NodeController.fetchLahan");
    } finally {
      farmer = name ?? 'PETANI';
      loadingLahan = false;
      notifyListeners();
      log(
        "Finished fetching lahan for userId: $userId",
        name: "NodeController.fetchLahan",
      );
    }
  }

  Future<void> changeLahan(NodeResponseModel? lahan) async {
    selectedLahan = lahan;
    sensorData = null;
    notifyListeners();

    if (lahan == null) return;

    await fetchSensorBySelectedNode();
  }

  Future<void> fetchSensorBySelectedNode() async {
    if (selectedLahan == null) return;

    try {
      loadingSensor = true;
      error = null;
      notifyListeners();

      await Future.delayed(const Duration(milliseconds: 500));

      sensorData = _getDummySensorByNodeId(selectedLahan!.id);
    } catch (e) {
      error = e.toString().replaceAll('Exception: ', '');
    } finally {
      loadingSensor = false;
      notifyListeners();
    }
  }

  SensorReadingModel _getDummySensorByNodeId(int nodeId) {
    switch (nodeId) {
      case 3:
        return const SensorReadingModel(
          ph: 6.8,
          kelembapan: 72,
          suhu: 28,
          nitrogen: 42,
          updatedAt: '2 menit lalu',
        );

      case 4:
        return const SensorReadingModel(
          ph: 5.1,
          kelembapan: 48,
          suhu: 34,
          nitrogen: 25,
          updatedAt: '5 menit lalu',
        );

      default:
        return const SensorReadingModel(
          ph: 6.5,
          kelembapan: 65,
          suhu: 29,
          nitrogen: 35,
          updatedAt: 'Baru saja',
        );
    }
  }

  bool get hasLahan {
    return lahanList.isNotEmpty;
  }

  bool get hasSelectedLahan {
    return selectedLahan != null;
  }

  String get farmerName {
    if (farmer != null && farmer!.isNotEmpty) {
      return farmer!;
    }

    return 'Petani';
  }
}

class SensorReadingModel {
  final double ph;
  final double kelembapan;
  final double suhu;
  final double nitrogen;
  final String updatedAt;

  const SensorReadingModel({
    required this.ph,
    required this.kelembapan,
    required this.suhu,
    required this.nitrogen,
    required this.updatedAt,
  });
}
