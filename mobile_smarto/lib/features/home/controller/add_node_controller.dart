import 'package:flutter/material.dart';

import '../../../core/errors/app_exception.dart';
import '../../../core/utils/error_parser.dart';
import '../data/node_api.dart';

import 'dart:developer';

class AddNodeController extends ChangeNotifier {
  bool checkingKode = false;
  bool kodeNodeValid = false;
  bool submitting = false;
  bool sessionExpired = false;
  String? error;

  Future<bool> checkKodeNode(String kodeNode) async {
    final normalized = kodeNode.trim().toUpperCase();

    if (normalized.isEmpty) {
      error = 'Kode node wajib diisi';
      kodeNodeValid = false;
      notifyListeners();
      return false;
    }

    try {
      checkingKode = true;
      error = null;
      notifyListeners();

      await NodeApi.checkKodeNode(normalized);

      kodeNodeValid = true;

      log('Kode node $normalized valid', name: 'AddNodeController.checkKodeNode');
      return true;
    } catch (e) {
      if (e is TokenExpiredException) {
        sessionExpired = true;
        notifyListeners();
      }
      kodeNodeValid = false;
      error = parseError(e);
      log('Error checking kode node: $error', name: 'AddNodeController.checkKodeNode');
      return false;
    } finally {
      checkingKode = false;
      notifyListeners();
    }
  }

  Future<bool> addNode({
    required String kodeNode,
    required String label,
    required String lat,
    required String lng,
  }) async {
    final normalized = kodeNode.trim().toUpperCase();

    if (!kodeNodeValid) {
      error = 'Silakan check kode node terlebih dahulu';
      notifyListeners();
      return false;
    }

    try {
      submitting = true;
      error = null;
      notifyListeners();

      await NodeApi.addNode(
        kodeNode: normalized,
        label: label.trim(),
        lat: lat.trim(),
        lng: lng.trim(),
      );

      log('Node $normalized berhasil ditambahkan', name: 'AddNodeController.addNode');
      return true;
    } catch (e) {
      if (e is TokenExpiredException) {
        sessionExpired = true;
        notifyListeners();
      }
      error = parseError(e);
      log('Error adding node: $error', name: 'AddNodeController.addNode');
      return false;
    } finally {
      submitting = false;
      notifyListeners();
    }
  }

  void invalidateKodeNode() {
    if (!kodeNodeValid) return;

    kodeNodeValid = false;
    error = null;
    notifyListeners();
  }

  void reset() {
    checkingKode = false;
    kodeNodeValid = false;
    submitting = false;
    sessionExpired = false;
    error = null;
    notifyListeners();
  }
}
