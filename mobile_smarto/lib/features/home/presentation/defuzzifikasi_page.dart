import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../home/model/fuzzy_response_model.dart'; // sesuaikan dengan path model Anda

const _green = Color(0xFF2E7D32);
const _greenLight = Color(0xFF66BB6A);

// ===========================================================================
// DEFINISI FUNGSI KEANGGOTAAN OUTPUT — Dosis Inokulasi Rhizobium (0–200 g/ha)
// Silakan samakan titik-titik ini dengan definisi fuzzy set di backend Anda.
// Bentuk: daftar FlSpot (x = dosis g/ha, y = derajat keanggotaan 0..1)
// ===========================================================================
const double _domainMax = 200;

final List<_OutputTerm> _outputTerms = [
  _OutputTerm(
    name: 'Sangat Rendah',
    color: const Color(0xFF9FBBD0),
    points: const [FlSpot(0, 1), FlSpot(12, 1), FlSpot(30, 0)],
    labelX: 2,
    labelRow: 0,
  ),
  _OutputTerm(
    name: 'Rendah',
    color: const Color(0xFF4F9BD9),
    points: const [FlSpot(40, 0), FlSpot(52, 1), FlSpot(75, 1), FlSpot(80, 0)],
    labelX: 54,
    labelRow: 0,
  ),
  _OutputTerm(
    name: 'Sedang',
    color: const Color(0xFF6C5DD3),
    points: const [FlSpot(60, 0), FlSpot(100, 1), FlSpot(140, 0)],
    labelX: 92,
    labelRow: 0,
  ),
  _OutputTerm(
    name: 'Tinggi',
    color: const Color(0xFFE0A020),
    points: const [
      FlSpot(120, 0),
      FlSpot(160, 1),
      FlSpot(185, 1),
      FlSpot(198, 0),
    ],
    labelX: 156,
    labelRow: 0,
  ),
  _OutputTerm(
    name: 'Sangat Tinggi',
    color: const Color(0xFFE8703A),
    points: const [FlSpot(178, 0), FlSpot(200, 1)],
    labelX: 165,
    labelRow: 1,
  ),
];

class DefuzzifikasiPage extends StatelessWidget {
  final FuzzyData? data;

  const DefuzzifikasiPage({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final fuzzy = data;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      appBar: AppBar(
        title: const Text(
          'Hasil Defuzzifikasi',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: _green,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: fuzzy == null
          ? const _EmptyResult()
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ResultHeaderCard(output: fuzzy.output),
                  const SizedBox(height: 20),

                  const _SectionTitle(
                    icon: Icons.show_chart_rounded,
                    title: 'Fungsi Keanggotaan Output',
                  ),
                  const SizedBox(height: 10),
                  _OutputMembershipChartCard(output: fuzzy.output),
                  const SizedBox(height: 20),

                  const _SectionTitle(
                    icon: Icons.input_rounded,
                    title: 'Data Input Sensor',
                  ),
                  const SizedBox(height: 10),
                  _InputGrid(input: fuzzy.input),
                  const SizedBox(height: 20),
                  

                  const _SectionTitle(
                    icon: Icons.bar_chart_rounded,
                    title: 'Derajat Keanggotaan Input (μ)',
                  ),
                  const SizedBox(height: 10),
                  _MembershipListCard(memberships: fuzzy.memberships),
                  const SizedBox(height: 20),

                  const _SectionTitle(
                    icon: Icons.water_drop_rounded,
                    title: 'Rekomendasi Pompa',
                  ),
                  const SizedBox(height: 10),
                  _VolumeCard(volume: fuzzy.output.volume),
                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }
}

// ===========================================================================
// HEADER: nilai defuzzifikasi + kategori + rule aktif
// ===========================================================================
class _ResultHeaderCard extends StatelessWidget {
  final FuzzyOutput output;

  const _ResultHeaderCard({required this.output});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [_green, _greenLight],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: _green.withOpacity(0.30),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.20),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.analytics_rounded,
                  color: Colors.white,
                  size: 26,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  output.defuzzifikasi.label,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              _KategoriChip(kategori: output.kategori.value),
            ],
          ),
          const SizedBox(height: 16),

          // Nilai utama hasil defuzzifikasi
          Text(
            output.defuzzifikasi.value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Dosis pupuk hasil perhitungan fuzzy',
            style: TextStyle(
              color: Colors.white.withOpacity(0.85),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 16),

          // Rule aktif
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.rule_rounded, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(
                  '${output.rule.label}: ',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 13,
                  ),
                ),
                Text(
                  output.rule.value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _KategoriChip extends StatelessWidget {
  final String kategori;

  const _KategoriChip({required this.kategori});

  Color get _chipColor {
    switch (kategori.toLowerCase()) {
      case 'sangat rendah':
      case 'rendah':
        return const Color(0xFF1565C0);
      case 'sedang':
        return const Color(0xFFF9A825);
      case 'tinggi':
      case 'sangat tinggi':
        return const Color(0xFFC62828);
      default:
        return const Color(0xFF455A64);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Text(
        kategori.isEmpty ? '-' : kategori,
        style: TextStyle(
          color: _chipColor,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

// ===========================================================================
// SECTION TITLE
// ===========================================================================
class _SectionTitle extends StatelessWidget {
  final IconData icon;
  final String title;

  const _SectionTitle({required this.icon, required this.title});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 20, color: _green),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}

// ===========================================================================
// INPUT GRID
// ===========================================================================
class _InputGrid extends StatelessWidget {
  final FuzzyInput input;

  const _InputGrid({required this.input});

  @override
  Widget build(BuildContext context) {
    final items = <({InputItem item, IconData icon})>[
      (item: input.ph, icon: Icons.science_outlined),
      (item: input.kelembapan, icon: Icons.water_drop_outlined),
      (item: input.suhu, icon: Icons.thermostat_outlined),
      (item: input.nitrogen, icon: Icons.grass_outlined),
    ];

    return GridView.builder(
      itemCount: items.length,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        mainAxisExtent: 96,
      ),
      itemBuilder: (context, index) {
        final entry = items[index];
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: _cardDecoration(),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  color: _green.withOpacity(0.10),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(entry.icon, color: _green, size: 22),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      entry.item.label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '${entry.item.value} ${entry.item.unit}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ===========================================================================
// OUTPUT MEMBERSHIP FUNCTION CHART (fl_chart LineChart) + garis CoG
// ===========================================================================
class _OutputMembershipChartCard extends StatelessWidget {
  final FuzzyOutput output;

  const _OutputMembershipChartCard({required this.output});

  /// Ambil angka dari string seperti "71.95 g/ha" -> 71.95
  double? get _cog {
    final match = RegExp(
      r'[-+]?\d*\.?\d+',
    ).firstMatch(output.defuzzifikasi.value);
    if (match == null) return null;
    return double.tryParse(match.group(0)!);
  }

  @override
  Widget build(BuildContext context) {
    final cog = _cog;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 16, 14, 12),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Fungsi keanggotaan output — Dosis Inokulasi Rhizobium (0–200 g/ha)',
            style: TextStyle(
              fontSize: 12.5,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),

          SizedBox(
            height: 240,
            child: LayoutBuilder(
              builder: (context, constraints) {
                final w = constraints.maxWidth;
                // Perkiraan lebar area plot (leftTitles disembunyikan),
                // sehingga x=0 di kiri dan x=200 di kanan.
                double px(double xVal) => (xVal / _domainMax) * w;

                return Stack(
                  clipBehavior: Clip.none,
                  children: [
                    _buildChart(cog),

                    // Label linguistik di atas tiap kurva
                    ..._outputTerms.map((term) {
                      final left = px(term.labelX).clamp(0.0, w - 40);
                      final top = 2.0 + term.labelRow * 16.0;
                      return Positioned(
                        left: left,
                        top: top,
                        child: IgnorePointer(
                          child: Text(
                            term.name,
                            style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w600,
                              color: term.color,
                            ),
                          ),
                        ),
                      );
                    }),

                    // Label CoG di dekat garis vertikal
                    if (cog != null && cog >= 0 && cog <= _domainMax)
                      Positioned(
                        left: (px(cog) + 4).clamp(0.0, w - 70),
                        top: 34,
                        child: IgnorePointer(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE0A020),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              'CoG ${cog.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 9.5,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  LineChart _buildChart(double? cog) {
    return LineChart(
      LineChartData(
        minX: 0,
        maxX: _domainMax,
        minY: 0,
        maxY: 1.18,
        clipData: const FlClipData.all(),
        lineTouchData: const LineTouchData(enabled: false),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: true,
          verticalInterval: 50,
          horizontalInterval: 0.5,
          getDrawingHorizontalLine: (v) =>
              FlLine(color: Colors.grey.shade100, strokeWidth: 1),
          getDrawingVerticalLine: (v) =>
              FlLine(color: Colors.grey.shade100, strokeWidth: 1),
        ),
        borderData: FlBorderData(
          show: true,
          border: Border(
            left: BorderSide(color: Colors.grey.shade300),
            bottom: BorderSide(color: Colors.grey.shade300),
          ),
        ),
        titlesData: FlTitlesData(
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false, reservedSize: 0),
          ),
          bottomTitles: AxisTitles(
            axisNameWidget: const Padding(
              padding: EdgeInsets.only(top: 4),
              child: Text(
                'Dosis Inokulasi Rhizobium (g/ha)',
                style: TextStyle(fontSize: 11, color: Colors.black54),
              ),
            ),
            axisNameSize: 20,
            sideTitles: SideTitles(
              showTitles: true,
              interval: 50,
              reservedSize: 22,
              getTitlesWidget: (value, meta) {
                if (value % 50 != 0) return const SizedBox.shrink();
                return Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    value.toInt().toString(),
                    style: const TextStyle(
                      fontSize: 10,
                      color: Colors.black54,
                    ),
                  ),
                );
              },
            ),
          ),
        ),
        // Garis vertikal CoG (hasil defuzzifikasi)
        extraLinesData: ExtraLinesData(
          verticalLines: [
            if (cog != null && cog >= 0 && cog <= _domainMax)
              VerticalLine(
                x: cog,
                color: const Color(0xFFE0A020),
                strokeWidth: 2,
                dashArray: const [6, 4],
              ),
          ],
        ),
        // Kurva tiap himpunan fuzzy output
        lineBarsData: _outputTerms.map((term) {
          return LineChartBarData(
            spots: term.points,
            isCurved: false,
            color: term.color,
            barWidth: 1.6,
            dashArray: const [6, 4],
            dotData: const FlDotData(show: false),
          );
        }).toList(),
      ),
    );
  }
}

class _OutputTerm {
  final String name;
  final Color color;
  final List<FlSpot> points;
  final double labelX; // posisi x untuk label (dalam satuan g/ha)
  final int labelRow; // baris label untuk menghindari tumpang tindih

  const _OutputTerm({
    required this.name,
    required this.color,
    required this.points,
    required this.labelX,
    required this.labelRow,
  });
}

// ===========================================================================
// DAFTAR DERAJAT KEANGGOTAAN INPUT (μ) — dari array memberships API
// ===========================================================================
class _MembershipListCard extends StatelessWidget {
  final List<FuzzyMembership> memberships;

  const _MembershipListCard({required this.memberships});

  static const _barColors = [
    Color(0xFF2E7D32),
    Color(0xFF0288D1),
    Color(0xFFF9A825),
    Color(0xFFC62828),
    Color(0xFF6A1B9A),
    Color(0xFF00897B),
  ];

  @override
  Widget build(BuildContext context) {
    if (memberships.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(22),
        decoration: _cardDecoration(),
        child: const Text(
          'Tidak ada data keanggotaan.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black54),
        ),
      );
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        children: List.generate(memberships.length, (index) {
          final item = memberships[index];
          final color = _barColors[index % _barColors.length];
          final value = item.value.clamp(0.0, 1.0);
          return Padding(
            padding: EdgeInsets.only(
              bottom: index == memberships.length - 1 ? 0 : 14,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.label,
                        style: const TextStyle(
                          fontSize: 12.5,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                    Text(
                      item.value.toStringAsFixed(2),
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: value,
                    minHeight: 7,
                    backgroundColor: color.withOpacity(0.12),
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                  ),
                ),
              ],
            ),
          );
        }),
      ),
    );
  }
}

// ===========================================================================
// VOLUME POMPA
// ===========================================================================
class _VolumeCard extends StatelessWidget {
  final VolumeItem volume;

  const _VolumeCard({required this.volume});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0288D1).withOpacity(0.10),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.water_drop_rounded,
                  color: Color(0xFF0288D1),
                  size: 26,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      volume.label,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      volume.value,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (volume.durasi.isNotEmpty) ...[
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF8E1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFFFE082)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.info_outline_rounded,
                    size: 18,
                    color: Color(0xFFF9A825),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      volume.durasi,
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF795548),
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ===========================================================================
// EMPTY STATE (jika data null)
// ===========================================================================
class _EmptyResult extends StatelessWidget {
  const _EmptyResult();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.analytics_outlined,
              size: 72,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            const Text(
              'Tidak Ada Hasil',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Data hasil defuzzifikasi tidak tersedia. Silakan proses ulang dari halaman utama.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}

BoxDecoration _cardDecoration() {
  return BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(18),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.06),
        blurRadius: 16,
        offset: const Offset(0, 8),
      ),
    ],
  );
}