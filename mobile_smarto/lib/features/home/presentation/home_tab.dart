import 'package:flutter/material.dart';

import '../../home/controller/node_controller.dart';
import '../../home/model/node_response_model.dart';
import '../../home/model/sensor_reading_model.dart';



class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  final NodeController _controller = NodeController();

  @override
  void initState() {
    super.initState();

    _controller.addListener(() {
      if (mounted) {
        setState(() {});
      }
    });

    _controller.fetchLahan();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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

    return SingleChildScrollView(
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

            const Text(
              'Sensor Monitor',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),

            const SizedBox(height: 10),

            if (_controller.loadingSensor || sensorData == null)
              const _SensorLoading()
            else
              _SensorGrid(sensorData: sensorData),
          ],
        ],
      ),
    );
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
                      child: Text(
                        lahan.dropdownLabel,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.w600),
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
      decoration: _cardDecoration(),
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
      decoration: _cardDecoration(),
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
      decoration: _cardDecoration(),
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
