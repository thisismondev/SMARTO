import 'package:flutter/material.dart';
import '../data/fuzzy_api.dart';
import '../model/fuzzy_response_model.dart'; // Sesuaikan dengan path model Anda
import 'dart:developer';

class FuzzyController extends ChangeNotifier {
  bool loading = false;
  String? error;
  FuzzyData? fuzzyData;

  // Fungsi untuk mengeksekusi fuzzy engine berdasarkan parameter input
  Future<bool> fetchFuzzyEngine({
    required double ph,
    required double kelembapan,
    required double suhu,
    required int nitrogen,
  }) async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      // Memanggil fungsi API dari NodeApi yang sudah Anda buat
      fuzzyData = await FuzzyApi.fuzzyEngine(
        ph: ph,
        kelembapan: kelembapan,
        suhu: suhu,
        nitrogen: nitrogen,
      );

      return true;
    } catch (e) {
      error = e.toString();
      log("Error fetching fuzzy engine: $error", name: "FuzzyController");
      return false;
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  void reset() {
    loading = false;
    error = null;
    fuzzyData = null;
    notifyListeners();
  }
}
