import 'package:flutter/material.dart';

import '../../../core/widgets/card_decoration.dart';
import '../../home/controller/node_controller.dart';
import '../../home/controller/fuzzy_controller.dart';
import '../../home/model/node_response_model.dart';
import '../../home/model/sensor_reading_model.dart';
import 'add_node_page.dart';
import 'defuzzifikasi_page.dart';

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> with AutomaticKeepAliveClientMixin {
  final NodeController _controller = NodeController();
  final FuzzyController _engineController = FuzzyController();

  bool _fabOpen = false;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();

    _controller.addListener(() {
      if (mounted) {
        setState(() {});
      }
    });

    _engineController.addListener(() {
      if (mounted) setState(() {});
    });

    _controller.fetchLahan();
  }

  @override
  void dispose() {
    _controller.dispose();
    _engineController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      body: Stack(
        children: [
          _buildBody(),
          if (_fabOpen)
            Positioned.fill(
              child: GestureDetector(
                onTap: _closeFabMenu,
                child: const ColoredBox(color: Colors.black45),
              ),
            ),
        ],
      ),
      floatingActionButton: _buildFabMenu(),
    );
  }

  void _toggleFabMenu() {
    setState(() => _fabOpen = !_fabOpen);
  }

  void _closeFabMenu() {
    if (_fabOpen) {
      setState(() => _fabOpen = false);
    }
  }

  Widget _buildFabMenu() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        _buildFabAction(
          icon: Icons.analytics_rounded,
          label: 'Proses Defuzzifikasi',
          onTap: () {
            _closeFabMenu();
            _handleDefuzzifikasi();
          },
        ),
        const SizedBox(height: 12),
        _buildFabAction(
          icon: Icons.add_rounded,
          label: 'Tambah Node',
          onTap: () {
            _closeFabMenu();
            _openAddNodePage();
          },
        ),
        const SizedBox(height: 12),
        FloatingActionButton(
          onPressed: _toggleFabMenu,
          backgroundColor: const Color(0xFF2E7D32),
          foregroundColor: Colors.white,
          elevation: 4,
          child: AnimatedRotation(
            turns: _fabOpen ? 0.125 : 0,
            duration: const Duration(milliseconds: 250),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 150),
              child: Icon(
                _fabOpen ? Icons.close : Icons.add,
                key: ValueKey(_fabOpen),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFabAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return AnimatedSize(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
      child: _fabOpen
          ? FloatingActionButton.extended(
              onPressed: onTap,
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF2E7D32),
              elevation: 3,
              icon: Icon(icon, size: 20),
              label: Text(
                label,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2E7D32),
                ),
              ),
            )
          : const SizedBox(width: 0, height: 0),
    );
  }

  Future<void> _handleDefuzzifikasi() async {
    final sensorData = _controller.sensorData;

    if (!_controller.hasSelectedLahan) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pilih lahan terlebih dahulu')),
      );
      return;
    }

    final success = await _engineController.fetchFuzzyEngine(
      ph: sensorData?.ph ?? 0,
      kelembapan: sensorData?.kelembapan ?? 0,
      suhu: sensorData?.suhu ?? 0,
      nitrogen: sensorData?.nitrogen ?? 0,
    );

    if (!mounted) return;

    if (success) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => DefuzzifikasiPage(
            data: _engineController.fuzzyData,
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _engineController.error ?? "Gagal memproses defuzzifikasi",
          ),
        ),
      );
    }
  }

  Widget _buildBody() {
    if (_controller.loadingLahan) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF2E7D32)),
      );
    }

    if (_controller.error != null) {
      return _ErrorState(
        message: _controller.error!,
        onRetry: () {
          _controller.fetchLahan();
        },
      );
    }

    if (!_controller.hasLahan) {
      return const _EmptyLahanState();
    }

    final selectedLahan = _controller.selectedLahan;
    final sensorData = _controller.sensorData;

    if (_engineController.loading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF2E7D32)),
      );
    }

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _HeaderSection(
                farmerName: _controller.farmerName,
                lahanList: _controller.lahanList,
                selectedLahan: selectedLahan,
                onChanged: (value) {
                  _controller.changeLahan(value);
                },
              ),

              const SizedBox(height: 18),

              if (selectedLahan == null) ...[
                const _SelectLahanFirstCard(),
              ] else ...[
                _LahanInfoCard(lahan: selectedLahan),

                const SizedBox(height: 20),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Sensor Monitor',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    if (sensorData != null)
                      Row(
                        children: [
                          Icon(
                            Icons.access_time,
                            size: 15,
                            color: Colors.grey.shade600,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            sensorData.updatedAtText,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                  ],
                ),

                const SizedBox(height: 10),

                if (_controller.loadingSensor || sensorData == null)
                  const _SensorLoading()
                else
                  _SensorGrid(sensorData: sensorData),
                const SizedBox(
                  height: 20,
                ), // Jarak antara grid sensor dan tombol utama
                // TOMBOL UTAMA: PROSES DEFUZZIFIKASI
                // SizedBox(
                //   width: double
                //       .infinity, // Membuat tombol full-width (lebar penuh)
                //   height: 54, // Membuat tombol lebih tebal dan mudah ditekan
                //   child: FilledButton.icon(
                //     onPressed: _handleDefuzzifikasi,
                //     style: FilledButton.styleFrom(
                //       backgroundColor: const Color(
                //         0xFF2E7D32,
                //       ), // Hijau gelap agar kontras
                //       shape: RoundedRectangleBorder(
                //         borderRadius: BorderRadius.circular(
                //           16,
                //         ), // Sesuai tema melengkung di dashboard Anda
                //       ),
                //       elevation: 2,
                //     ),
                //     icon: const Icon(
                //       Icons.analytics_rounded,
                //       size: 24,
                //       color: Colors.white,
                //     ),
                //     label: const Text(
                //       'PROSES DEFUZZIFIKASI',
                //       style: TextStyle(
                //         fontSize: 14,
                //         fontWeight: FontWeight.bold,
                //         letterSpacing: 1.2, // Memberikan kesan tegas/utama
                //         color: Colors.white,
                //       ),
                //     ),
                //   ),
                // ),
              ],
            ],
          ),
        ),
        if (_engineController.loading)
          Container(
            color: Colors.black45,
            child: const Center(
              child: CircularProgressIndicator(color: Colors.white),
            ),
          ),
      ],
    );
  }

  Future<void> _openAddNodePage() async {
    final added = await Navigator.push<bool>(
      context,
      MaterialPageRoute(builder: (_) => const AddNodePage()),
    );

    if (added == true) {
      _controller.fetchLahan();
    }
  }
}

class _HeaderSection extends StatelessWidget {
  final String farmerName;
  final List<NodeResponseModel> lahanList;
  final NodeResponseModel? selectedLahan;
  final ValueChanged<NodeResponseModel?> onChanged;

  const _HeaderSection({
    required this.farmerName,
    required this.lahanList,
    required this.selectedLahan,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.20),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.eco_rounded,
                  color: Colors.white,
                  size: 34,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Halo, $farmerName',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 21,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Pilih lahan untuk melihat data sensor',
                      style: TextStyle(color: Colors.white, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<NodeResponseModel?>(
                value: selectedLahan,
                isExpanded: true,
                hint: const Text(
                  'Pilih Lahan',
                  style: TextStyle(
                    color: Colors.black54,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                icon: const Icon(Icons.keyboard_arrow_down),
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

                  ...lahanList.map((lahan) {
                    return DropdownMenuItem<NodeResponseModel?>(
                    value: lahan,
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            lahan.label,
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
                            color: lahan.isActive
                                ? Colors.green[700]
                                : Colors.grey,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            lahan.kodeNode,
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
                onChanged: onChanged,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SelectLahanFirstCard extends StatelessWidget {
  const _SelectLahanFirstCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: cardDecoration(),
      child: Column(
        children: [
          Icon(
            Icons.touch_app_outlined,
            size: 60,
            color: Colors.green.shade300,
          ),
          const SizedBox(height: 14),
          const Text(
            'Pilih Lahan Terlebih Dahulu',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Silakan pilih salah satu lahan atau kode node pada bagian atas untuk melihat detail dan data sensor.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
          ),
        ],
      ),
    );
  }
}

class _LahanInfoCard extends StatelessWidget {
  final NodeResponseModel lahan;

  const _LahanInfoCard({required this.lahan});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: cardDecoration(),
      child: Column(
        children: [
          _InfoTile(
            icon: Icons.grass_outlined,
            title: 'Nama Lahan',
            subtitle: lahan.label,
          ),
          const Divider(height: 1),
          _InfoTile(
            icon: Icons.memory_outlined,
            title: 'Kode Node',
            subtitle: lahan.kodeNode,
          ),
          const Divider(height: 1),
          _InfoTile(
            icon: Icons.location_on_outlined,
            title: 'Lokasi',
            subtitle: lahan.locationText,
          ),
          const Divider(height: 1),
          _InfoTile(
            icon: Icons.wifi_tethering,
            title: 'Status Node',
            subtitle: lahan.statusText,
            subtitleColor: lahan.isActive
                ? const Color(0xFF2E7D32)
                : Colors.red,
          ),
        ],
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color? subtitleColor;

  const _InfoTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.subtitleColor,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF2E7D32)),
      title: Text(
        title,
        style: const TextStyle(fontSize: 13, color: Colors.black54),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: subtitleColor ?? Colors.black87,
        ),
      ),
    );
  }
}

class _SensorGrid extends StatelessWidget {
  final SensorReadingModel sensorData;

  const _SensorGrid({required this.sensorData});

  @override
  Widget build(BuildContext context) {
    final sensors = [
      _SensorCardData(
        title: 'pH Tanah',
        value: sensorData.ph.toString(),
        unit: 'pH',
        icon: Icons.science_outlined,
        color: const Color(0xFF2E7D32),
        status: 'Aman',
      ),
      _SensorCardData(
        title: 'Kelembapan',
        value: sensorData.kelembapan.toString(),
        unit: '%',
        icon: Icons.water_drop_outlined,
        color: const Color(0xFF2E7D32),
        status: 'Aman',
      ),
      _SensorCardData(
        title: 'Suhu',
        value: sensorData.suhu.toString(),
        unit: '°C',
        icon: Icons.thermostat_outlined,
        color: const Color(0xFFF9A825),
        status: 'Peringatan',
      ),
      _SensorCardData(
        title: 'Nitrogen',
        value: sensorData.nitrogen.toString(),
        unit: 'mg/kg',
        icon: Icons.grass_outlined,
        color: const Color(0xFFC62828),
        status: 'Bahaya',
      ),
    ];

    return GridView.builder(
      itemCount: sensors.length,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        mainAxisExtent: 160,
      ),
      itemBuilder: (context, index) {
        return _SensorCard(sensor: sensors[index]);
      },
    );
  }
}

class _SensorCardData {
  final String title;
  final String value;
  final String unit;
  final IconData icon;
  final Color color;
  final String status;

  const _SensorCardData({
    required this.title,
    required this.value,
    required this.unit,
    required this.icon,
    required this.color,
    required this.status,
  });
}

class _SensorCard extends StatelessWidget {
  final _SensorCardData sensor;

  const _SensorCard({required this.sensor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: sensor.color.withOpacity(0.35)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 14,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(sensor.icon, color: sensor.color, size: 28),
          const Spacer(),
          Text(
            sensor.title,
            style: const TextStyle(fontSize: 13, color: Colors.black54),
          ),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                sensor.value,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 4),
              Padding(
                padding: const EdgeInsets.only(bottom: 3),
                child: Text(
                  sensor.unit,
                  style: const TextStyle(fontSize: 11, color: Colors.black54),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            sensor.status,
            style: TextStyle(
              color: sensor.color,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

class _SensorLoading extends StatelessWidget {
  const _SensorLoading();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 180,
      width: double.infinity,
      decoration: cardDecoration(),
      child: const Center(
        child: CircularProgressIndicator(color: Color(0xFF2E7D32)),
      ),
    );
  }
}

class _EmptyLahanState extends StatelessWidget {
  const _EmptyLahanState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.grass_outlined, size: 72, color: Colors.grey.shade400),
            const SizedBox(height: 16),
            const Text(
              'Belum Ada Lahan',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Akun Anda belum memiliki lahan atau kode node yang terhubung.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _ErrorState({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 72, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'Gagal Memuat Data',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 18),
            FilledButton(onPressed: onRetry, child: const Text('Coba Lagi')),
          ],
        ),
      ),
    );
  }
}


