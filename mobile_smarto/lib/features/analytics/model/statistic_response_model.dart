import '../../../core/utils/type_converter.dart';

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
      avgPh: toDouble(json['avg_ph']),
      avgKelembapan: toDouble(json['avg_kelembapan']),
      avgSuhu: toDouble(json['avg_suhu']),
      avgNitrogen: toDouble(json['avg_nitrogen']),
    );
  }
}