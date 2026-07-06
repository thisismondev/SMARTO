import 'dart:developer';

import 'package:flutter/material.dart';
import '../model/node_response_model.dart';
import '../model/statistic_response_model.dart';
import '../data/node_api.dart';
import '../data/statistic_api.dart';

import '../../../core/storage/token_storage.dart';

class AnalyticsController extends ChangeNotifier {
  // State data node
  List<NodeResponseModel> _nodes = [];
  NodeResponseModel? _selectedNode;

  List<StatisticModel> _analytics = [];

  // State filter periode: day, month, year
  String _selectedPeriod = 'day';

  // State UI
  bool _isLoading = false;
  bool _isAnalyticsLoading = false;

  String? _errorMessage;
  String? _analyticsErrorMessage;

  List<NodeResponseModel> get nodes => _nodes;
  NodeResponseModel? get selectedNode => _selectedNode;

  List<StatisticModel> get analytics => _analytics;

  String get selectedPeriod => _selectedPeriod;

  bool get isLoading => _isLoading;
  bool get isAnalyticsLoading => _isAnalyticsLoading;

  String? get errorMessage => _errorMessage;
  String? get analyticsErrorMessage => _analyticsErrorMessage;

  bool get hasNodes => _nodes.isNotEmpty;
  bool get hasAnalytics => _analytics.isNotEmpty;

  /// Fungsi untuk mengambil daftar node berdasarkan userId dari API
  Future<void> fetchNodes() async {
    final userId = await TokenStorage.getUserId();

    _isLoading = true;
    _errorMessage = null;
    notifyListeners(); // Beritahu UI untuk menampilkan loading spinner

    try {
      final result = await NodeApi.getMyNodes(userId: userId ?? 0);
      _nodes = result;

      log("Fetched ${_nodes.length} node(s) for userId: $userId");

      _selectedNode = null;
    } catch (e) {
      _errorMessage = 'Gagal memuat data perangkat: $e';
      log("Error fetching nodes: $_errorMessage");
    } finally {
      _isLoading = false;
      notifyListeners(); // Beritahu UI untuk memperbarui tampilan (selesai loading / error)
    }

    if (_selectedNode != null) {
      await fetchAnalytics();
    }
  }

  /// Fungsi untuk mengubah node yang dipilih saat petani memilih dropdown
  Future<void> selectNode(NodeResponseModel? node) async {
    _selectedNode = node;
    _analytics = [];
    _analyticsErrorMessage = null;

    notifyListeners();

    if (node != null) {
      await fetchAnalytics();
    }
  }

  Future<void> changePeriod(String period) async {
    if (_selectedPeriod == period) return;

    _selectedPeriod = period;
    _analytics = [];
    _analyticsErrorMessage = null;

    notifyListeners();

    if (_selectedNode != null) {
      await fetchAnalytics();
    }
  }

  Future<void> fetchAnalytics() async {
    final node = _selectedNode;

    if (node == null) {
      _analytics = [];
      notifyListeners();
      return;
    }

    _isAnalyticsLoading = true;
    _analyticsErrorMessage = null;
    notifyListeners();

    try {
      final result = await StatisticApi.getSensorStatistics(
        kodeNodeId: node.kodeNodeId,
        periode: _selectedPeriod,
      );

      _analytics = result;

      log(
        "Fetched ${_analytics.length} analytics data for kodeNodeId: ${node.kodeNodeId}, period: $_selectedPeriod",
      );
    } catch (e) {
      _analyticsErrorMessage = 'Gagal memuat data analytics: $e';
      log("Error fetching analytics: $_analyticsErrorMessage");
    } finally {
      _isAnalyticsLoading = false;
      notifyListeners();
    }
  }

  Future<void> refresh() async {
    if (_selectedNode == null) {
      await fetchNodes();
    } else {
      await fetchAnalytics();
    }
  }
}
