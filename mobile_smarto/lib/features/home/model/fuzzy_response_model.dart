class FuzzyData {
  final FuzzyInput input;
  final List<FuzzyMembership> memberships;
  final FuzzyOutput output;

  FuzzyData({
    required this.input,
    required this.memberships,
    required this.output,
  });

  factory FuzzyData.fromJson(Map<String, dynamic> json) {
    return FuzzyData(
      input: FuzzyInput.fromJson(json['input'] ?? {}),
      memberships: (json['memberships'] as List?)
              ?.map((item) => FuzzyMembership.fromJson(item))
              .toList() ?? [],
      output: FuzzyOutput.fromJson(json['output'] ?? {}),
    );
  }
}

class FuzzyInput {
  final InputItem ph;
  final InputItem kelembapan;
  final InputItem suhu;
  final InputItem nitrogen;

  FuzzyInput({
    required this.ph,
    required this.kelembapan,
    required this.suhu,
    required this.nitrogen,
  });

  factory FuzzyInput.fromJson(Map<String, dynamic> json) {
    return FuzzyInput(
      ph: InputItem.fromJson(json['ph'] ?? {}),
      kelembapan: InputItem.fromJson(json['kelembapan'] ?? {}),
      suhu: InputItem.fromJson(json['suhu'] ?? {}),
      nitrogen: InputItem.fromJson(json['nitrogen'] ?? {}),
    );
  }
}

class InputItem {
  final String label;
  final double value;
  final String unit;

  InputItem({
    required this.label,
    required this.value,
    required this.unit,
  });

  factory InputItem.fromJson(Map<String, dynamic> json) {
    return InputItem(
      label: json['label'] ?? '',
      value: (json['value'] as num?)?.toDouble() ?? 0.0,
      unit: json['unit'] ?? '',
    );
  }
}

class FuzzyMembership {
  final String label;
  final double value;

  FuzzyMembership({
    required this.label,
    required this.value,
  });

  factory FuzzyMembership.fromJson(Map<String, dynamic> json) {
    return FuzzyMembership(
      label: json['label'] ?? '',
      value: (json['value'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class FuzzyOutput {
  final OutputItem rule;
  final OutputItem defuzzifikasi;
  final OutputItem kategori;
  final VolumeItem volume;

  FuzzyOutput({
    required this.rule,
    required this.defuzzifikasi,
    required this.kategori,
    required this.volume,
  });

  factory FuzzyOutput.fromJson(Map<String, dynamic> json) {
    return FuzzyOutput(
      rule: OutputItem.fromJson(json['rule'] ?? {}),
      defuzzifikasi: OutputItem.fromJson(json['defuzzifikasi'] ?? {}),
      kategori: OutputItem.fromJson(json['kategori'] ?? {}),
      volume: VolumeItem.fromJson(json['volume'] ?? {}),
    );
  }
}

class OutputItem {
  final String label;
  final String value;

  OutputItem({
    required this.label,
    required this.value,
  });

  factory OutputItem.fromJson(Map<String, dynamic> json) {
    return OutputItem(
      label: json['label'] ?? '',
      value: json['value']?.toString() ?? '',
    );
  }
}

class VolumeItem {
  final String label;
  final String value;
  final String durasi;

  VolumeItem({
    required this.label,
    required this.value,
    required this.durasi,
  });

  factory VolumeItem.fromJson(Map<String, dynamic> json) {
    return VolumeItem(
      label: json['label'] ?? '',
      value: json['value'] ?? '',
      durasi: json['durasi'] ?? '',
    );
  }
}