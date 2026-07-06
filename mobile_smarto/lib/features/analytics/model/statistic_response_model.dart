class StatisticModel {
  final String periode;
  final double avgPh;
  final double avgKelembapan;
  final double avgSuhu;
  final double avgNitrogen;

  StatisticModel({
    required this.periode,
    required this.avgPh,
    required this.avgKelembapan,
    required this.avgSuhu,
    required this.avgNitrogen,
  });

  factory StatisticModel.fromJson(Map<String, dynamic> json) {
    return StatisticModel(
      periode: json['periode'] != null ? json['periode'] as String : DateTime.now().toString(),
      avgPh: _toDouble(json['avg_ph']),
      avgKelembapan: _toDouble(json['avg_kelembapan']),
      avgSuhu: _toDouble(json['avg_suhu']),
      avgNitrogen: _toDouble(json['avg_nitrogen']),
    );
  }

  static double _toDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0.0;
  }
}