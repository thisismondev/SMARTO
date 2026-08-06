import 'package:flutter/material.dart';

import 'package:supabase_flutter/supabase_flutter.dart';

import '../data/node_api.dart';
import '../data/sensor_api.dart';
import '../model/sensor_reading_model.dart';
import '../model/node_response_model.dart';

import '../../../core/errors/app_exception.dart';
import '../../../core/storage/token_storage.dart';
import '../../../core/utils/error_parser.dart';

import 'dart:developer';

class NodeController extends ChangeNotifier {
  bool loadingLahan = false;
  bool loadingSensor = false;
  bool sessionExpired = false;
  String? error;

  List<NodeResponseModel> lahanList = [];
  NodeResponseModel? selectedLahan;
  SensorReadingModel? sensorData;

  String? farmer;

  RealtimeChannel? _sensorChannel;

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
      if (e is TokenExpiredException) {
        sessionExpired = true;
        notifyListeners();
      }
      error = parseError(e);
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
    error = null;
    notifyListeners();

    await _removeSensorChannel();

    if (lahan == null) return;

    await fetchSensorBySelectedNode();
    subscribeSensorBySelectedNode();
  }

  Future<void> fetchSensorBySelectedNode() async {
    if (selectedLahan == null) return;

    try {
      loadingSensor = true;
      error = null;
      notifyListeners();

      final sensor = await SensorApi.fetchLatestSensor(
        kodeNodeId: selectedLahan!.kodeNodeId,
      );

      sensorData = sensor;

      log(
        'Sensor terbaru berhasil diambil untuk kodeNodeId: ${selectedLahan!.kodeNodeId}',
        name: 'NodeController.fetchSensorBySelectedNode',
      );
    } catch (e) {
      if (e is TokenExpiredException) {
        sessionExpired = true;
        notifyListeners();
      }
      error = parseError(e);

      log(
        'Error fetching sensor: $error',
        name: 'NodeController.fetchSensorBySelectedNode',
      );
    } finally {
      loadingSensor = false;
      notifyListeners();
    }
  }

  void subscribeSensorBySelectedNode() {
    if (selectedLahan == null) return;

    _sensorChannel = SensorApi.subscribeSensor(
      kodeNodeId: selectedLahan!.kodeNodeId,
      onData: (sensor) {
        sensorData = sensor;
        notifyListeners();

        log(
          'Realtime sensor update: pH=${sensor.ph}, suhu=${sensor.suhu}, kelembapan=${sensor.kelembapan}, nitrogen=${sensor.nitrogen}',
          name: 'NodeController.subscribeSensorBySelectedNode',
        );
      },
    );
  }

  Future<void> _removeSensorChannel() async {
    if (_sensorChannel != null) {
      await SensorApi.removeChannel(_sensorChannel!);
      _sensorChannel = null;

      log(
        'Sensor channel lama dihapus',
        name: 'NodeController._removeSensorChannel',
      );
    }
  }

  @override
  void dispose() {
    if (_sensorChannel != null) {
      // Fire-and-forget: channel cleanup runs asynchronously
      SensorApi.removeChannel(_sensorChannel!);
      _sensorChannel = null;
    }

    super.dispose();
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