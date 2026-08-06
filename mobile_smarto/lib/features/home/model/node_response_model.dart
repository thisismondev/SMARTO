import '../../../core/utils/type_converter.dart';

class NodeResponseModel {
  final int id;
  final int kodeNodeId;
  final String kodeNode;
  final int userId;
  final String name;
  final String label;
  final double latitude;
  final double longitude;
  final int status;

  NodeResponseModel({
    required this.id,
    required this.kodeNodeId,
    required this.kodeNode,
    required this.userId,
    required this.name,
    required this.label,
    required this.latitude,
    required this.longitude,
    required this.status,
  });

  factory NodeResponseModel.fromJson(Map<String, dynamic> json) {
    return NodeResponseModel(
      id: json['id'],
      kodeNodeId: json['kode_node_id'],
      kodeNode: json['kode_node']?.toString() ?? '',
      userId: json['user_id'],
      name: json['name']?.toString() ?? '',
      label: json['label']?.toString() ?? '',
      latitude: toDouble(json['latitude']),
      longitude: toDouble(json['longitude']),
      status: json['status'],
    );
  }

  String get dropdownLabel {
    return '$label ($kodeNode)';
  }

  String get locationText {
    if (latitude == 0 && longitude == 0) {
      return '-';
    }

    return '${latitude.toStringAsFixed(6)}, ${longitude.toStringAsFixed(6)}';
  }

  bool get isActive {
    return status == 0;
  }

  String get statusText {
    return isActive ? 'Aktif' : 'Nonaktif';
  }
}