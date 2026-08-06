import '../../../core/utils/type_converter.dart';

class SensorReadingModel {
  final int id;
  final int kodeNodeId;
  final double ph;
  final double kelembapan;
  final double suhu;
  final int nitrogen;
  final String? updatedAt;

  const SensorReadingModel({
    required this.id,
    required this.kodeNodeId,
    required this.ph,
    required this.kelembapan,
    required this.suhu,
    required this.nitrogen,
    this.updatedAt,
  });

  factory SensorReadingModel.fromJson(Map<String, dynamic> json) {
    return SensorReadingModel(
      id: json['id'],
      kodeNodeId: json['kode_node_id'],
      ph: toDouble(json['ph']),
      kelembapan: toDouble(json['kelembapan']),
      suhu: toDouble(json['suhu']),
      nitrogen: json['nitrogen'],
      updatedAt: json['update_at']?.toString() ?? '-',
    );
  }

  String get updatedAtText {
    if (updatedAt == null || updatedAt!.isEmpty) return '-';

    final dateTime = DateTime.tryParse(updatedAt!);
    if (dateTime == null) return updatedAt!;

    final localTime = dateTime.toLocal();

    String twoDigit(int value) => value.toString().padLeft(2, '0');

    return '${twoDigit(localTime.day)}/${twoDigit(localTime.month)}/${localTime.year} '
        '${twoDigit(localTime.hour)}:${twoDigit(localTime.minute)}';
  }
}
