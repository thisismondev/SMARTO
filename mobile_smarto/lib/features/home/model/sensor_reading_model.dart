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
      ph: _toDouble(json['ph']),
      kelembapan: _toDouble(json['kelembapan']),
      suhu: _toDouble(json['suhu']),
      nitrogen: json['nitrogen'],
      updatedAt: json['update_at']?.toString() ?? '-',
    );
  }

  static double _toDouble(dynamic value) {
    if (value == null) return 0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0;
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
