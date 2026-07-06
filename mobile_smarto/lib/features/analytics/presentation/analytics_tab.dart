import 'dart:math';

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../controller/analytics_controller.dart';
import '../model/node_response_model.dart';

class AnalyticsTab extends StatefulWidget {
  const AnalyticsTab({super.key});

  @override
  State<AnalyticsTab> createState() => _AnalyticsTabState();
}

class _AnalyticsTabState extends State<AnalyticsTab>
    with AutomaticKeepAliveClientMixin {
  final AnalyticsController _analyticsController = AnalyticsController();

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _analyticsController.fetchNodes();
  }

  @override
  void dispose() {
    _analyticsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    return ListenableBuilder(
      listenable: _analyticsController,
      builder: (context, child) {
        if (_analyticsController.isLoading) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(32.0),
              child: CircularProgressIndicator(color: Colors.green),
            ),
          );
        }

        if (_analyticsController.errorMessage != null) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                _analyticsController.errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _analyticsController.refresh,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildFieldSelectorCard(),
                const SizedBox(height: 20),
                _buildSelectedNodeInfo(),
                const SizedBox(height: 20),
                _buildPeriodTabs(),
                const SizedBox(height: 20),
                _buildStatisticSection(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFieldSelectorCard() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.location_on, color: Colors.green[700], size: 28),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Lokasi Lahan / Node',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Pilih lahan untuk melihat statistik data',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            DropdownButtonFormField<NodeResponseModel?>(
              value: _analyticsController.selectedNode,
              isExpanded: true,
              decoration: InputDecoration(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                filled: true,
                fillColor: Colors.green[50],
                enabledBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: Colors.green[200]!,
                    width: 1,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(
                    color: Colors.green[700]!,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              items: [
                const DropdownMenuItem<NodeResponseModel?>(
                  value: null,
                  child: Text(
                    'Pilih Lahan',
                    style: TextStyle(
                      color: Colors.black54,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                ..._analyticsController.nodes.map((NodeResponseModel node) {
                  return DropdownMenuItem<NodeResponseModel?>(
                    value: node,
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            node.label,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 15,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: node.isActive
                                ? Colors.green[700]
                                : Colors.grey,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            node.kodeNode,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
              onChanged: (NodeResponseModel? newValue) {
                _analyticsController.selectNode(newValue);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedNodeInfo() {
    final selectedNode = _analyticsController.selectedNode;

    return Center(
      child: Text(
        selectedNode != null
            ? 'Lahan Terpilih: ${selectedNode.label} (${selectedNode.statusText})'
            : 'Belum ada lahan yang dipilih.',
        textAlign: TextAlign.center,
        style: TextStyle(color: Colors.grey[600]),
      ),
    );
  }

  Widget _buildPeriodTabs() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.green[50],
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.green[100]!),
      ),
      child: Row(
        children: [
          _buildPeriodTab(
            label: 'Last 1 Day',
            value: 'day',
          ),
          _buildPeriodTab(
            label: 'Last 1 Month',
            value: 'month',
          ),
          _buildPeriodTab(
            label: 'Last 1 Year',
            value: 'year',
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodTab({
    required String label,
    required String value,
  }) {
    final bool isSelected = _analyticsController.selectedPeriod == value;

    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: () {
          _analyticsController.changePeriod(value);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? Colors.green[700] : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.white : Colors.green[800],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatisticSection() {
    final selectedNode = _analyticsController.selectedNode;

    if (selectedNode == null) {
      return _buildEmptyCard(
        icon: Icons.info_outline,
        message: 'Pilih lahan terlebih dahulu untuk melihat statistik sensor.',
      );
    }

    if (_analyticsController.isAnalyticsLoading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: CircularProgressIndicator(color: Colors.green),
        ),
      );
    }

    if (_analyticsController.analyticsErrorMessage != null) {
      return _buildEmptyCard(
        icon: Icons.error_outline,
        message: _analyticsController.analyticsErrorMessage!,
        color: Colors.red,
      );
    }

    if (!_analyticsController.hasAnalytics) {
      return _buildEmptyCard(
        icon: Icons.insert_chart_outlined,
        message: 'Belum ada data statistik untuk periode ini.',
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Grafik Statistik Sensor',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.green[800],
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Periode: ${_getPeriodLabel(_analyticsController.selectedPeriod)}',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),

        const SizedBox(height: 16),

        _buildParameterChartCard(
          title: 'pH Tanah',
          unit: 'pH',
          icon: Icons.science,
          color: Colors.green,
          valueBuilder: (index) {
            return _analyticsController.analytics[index].avgPh;
          },
        ),

        _buildParameterChartCard(
          title: 'Kelembapan Tanah',
          unit: '%',
          icon: Icons.water_drop,
          color: Colors.blue,
          valueBuilder: (index) {
            return _analyticsController.analytics[index].avgKelembapan;
          },
        ),

        _buildParameterChartCard(
          title: 'Suhu Tanah',
          unit: '°C',
          icon: Icons.thermostat,
          color: Colors.orange,
          valueBuilder: (index) {
            return _analyticsController.analytics[index].avgSuhu;
          },
        ),

        _buildParameterChartCard(
          title: 'Nitrogen',
          unit: 'mg/kg',
          icon: Icons.grass,
          color: Colors.teal,
          valueBuilder: (index) {
            return _analyticsController.analytics[index].avgNitrogen;
          },
        ),
      ],
    );
  }

  Widget _buildParameterChartCard({
    required String title,
    required String unit,
    required IconData icon,
    required Color color,
    required double Function(int index) valueBuilder,
  }) {
    final data = _analyticsController.analytics;

    if (data.isEmpty) {
      return const SizedBox();
    }

    final spots = List.generate(data.length, (index) {
      return FlSpot(
        index.toDouble(),
        valueBuilder(index),
      );
    });

    final values = spots.map((spot) => spot.y).toList();

    double minY = values.reduce(min);
    double maxY = values.reduce(max);

    if (minY == maxY) {
      minY = minY - 1;
      maxY = maxY + 1;
    } else {
      final padding = (maxY - minY) * 0.15;
      minY = minY - padding;
      maxY = maxY + padding;
    }

    final latestValue = values.isNotEmpty ? values.last : 0.0;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildChartHeader(
              title: title,
              unit: unit,
              icon: icon,
              color: color,
              latestValue: latestValue,
            ),

            const SizedBox(height: 20),

            SizedBox(
              height: 230,
              child: LineChart(
                LineChartData(
                  minX: 0,
                  maxX: (data.length - 1).toDouble(),
                  minY: minY,
                  maxY: maxY,

                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: _getHorizontalInterval(minY, maxY),
                    getDrawingHorizontalLine: (value) {
                      return FlLine(
                        color: Colors.grey.withOpacity(0.2),
                        strokeWidth: 1,
                      );
                    },
                  ),

                  borderData: FlBorderData(
                    show: true,
                    border: Border.all(
                      color: Colors.grey.withOpacity(0.2),
                    ),
                  ),

                  titlesData: FlTitlesData(
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 42,
                        interval: _getHorizontalInterval(minY, maxY),
                        getTitlesWidget: (value, meta) {
                          return Text(
                            value.toStringAsFixed(1),
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.grey[600],
                            ),
                          );
                        },
                      ),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 34,
                        interval: _getBottomInterval(data.length),
                        getTitlesWidget: (value, meta) {
                          final index = value.toInt();

                          if (index < 0 || index >= data.length) {
                            return const SizedBox();
                          }

                          return SideTitleWidget(
                            meta: meta,
                            child: Text(
                              _formatPeriodeLabel(data[index].periode),
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey[600],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),

                  lineBarsData: [
                    LineChartBarData(
                      spots: spots,
                      isCurved: true,
                      color: color,
                      barWidth: 3,
                      isStrokeCapRound: true,
                      preventCurveOverShooting: true,
                      dotData: FlDotData(
                        show: data.length <= 12,
                      ),
                      belowBarData: BarAreaData(
                        show: true,
                        color: color.withOpacity(0.08),
                      ),
                    ),
                  ],

                  lineTouchData: LineTouchData(
                    enabled: true,
                    touchTooltipData: LineTouchTooltipData(
                      getTooltipItems: (touchedSpots) {
                        return touchedSpots.map((spot) {
                          final index = spot.x.toInt();

                          if (index < 0 || index >= data.length) {
                            return null;
                          }

                          final periode = data[index].periode;

                          return LineTooltipItem(
                            '${_formatPeriodeLabel(periode)}\n'
                            '${spot.y.toStringAsFixed(2)} $unit',
                            const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          );
                        }).toList();
                      },
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChartHeader({
    required String title,
    required String unit,
    required IconData icon,
    required Color color,
    required double latestValue,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: color,
            size: 20,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Nilai terakhir: ${latestValue.toStringAsFixed(2)} $unit',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  double _getHorizontalInterval(double minY, double maxY) {
    final range = maxY - minY;

    if (range <= 0) return 1;

    return range / 4;
  }

  double _getBottomInterval(int length) {
    if (length <= 6) return 1;
    if (length <= 12) return 2;
    if (length <= 24) return 4;
    if (length <= 31) return 5;

    return (length / 6).ceilToDouble();
  }

  String _formatPeriodeLabel(String periode) {
    try {
      final normalized = periode.replaceFirst(' ', 'T');
      final date = DateTime.parse(normalized);

      switch (_analyticsController.selectedPeriod) {
        case 'day':
          return '${date.hour.toString().padLeft(2, '0')}:00';

        case 'month':
          return '${date.day}/${date.month}';

        case 'year':
          return '${date.month}/${date.year}';

        default:
          return periode;
      }
    } catch (_) {
      return periode;
    }
  }

  String _getPeriodLabel(String period) {
    switch (period) {
      case 'day':
        return 'Last 1 Day';
      case 'month':
        return 'Last 1 Month';
      case 'year':
        return 'Last 1 Year';
      default:
        return period;
    }
  }

  Widget _buildEmptyCard({
    required IconData icon,
    required String message,
    Color color = Colors.grey,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: Column(
            children: [
              Icon(icon, color: color, size: 32),
              const SizedBox(height: 10),
              Text(
                message,
                textAlign: TextAlign.center,
                style: TextStyle(color: color),
              ),
            ],
          ),
        ),
      ),
    );
  }
}