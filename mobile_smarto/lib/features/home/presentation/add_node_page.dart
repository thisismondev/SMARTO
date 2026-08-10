import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';

import '../../../core/widgets/card_decoration.dart';
import '../controller/add_node_controller.dart';

class AddNodePage extends StatefulWidget {
  const AddNodePage({super.key});

  @override
  State<AddNodePage> createState() => _AddNodePageState();
}

class _AddNodePageState extends State<AddNodePage> {
  final AddNodeController _controller = AddNodeController();

  final _formKey = GlobalKey<FormState>();
  final _kodeNodeController = TextEditingController();
  final _labelController = TextEditingController();
  final _latController = TextEditingController();
  final _lngController = TextEditingController();

  bool _gettingLocation = false;

  @override
  void initState() {
    super.initState();

    _controller.addListener(() {
      if (mounted) setState(() {});
    });

    _kodeNodeController.addListener(_controller.invalidateKodeNode);
  }

  @override
  void dispose() {
    _kodeNodeController.dispose();
    _labelController.dispose();
    _latController.dispose();
    _lngController.dispose();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _handleCheckKodeNode() async {
    await _controller.checkKodeNode(_kodeNodeController.text);
  }

  Future<void> _handleGetCurrentLocation() async {
    setState(() => _gettingLocation = true);

    try {
      LocationPermission permission = await Geolocator.checkPermission();

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied) {
        if (mounted) _showSnackBar('Izin lokasi ditolak');
        return;
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          _showSnackBar(
            'Izin lokasi ditolak permanen, aktifkan lewat pengaturan',
          );
        }
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      _latController.text = position.latitude.toStringAsFixed(6);
      _lngController.text = position.longitude.toStringAsFixed(6);
    } catch (e) {
      if (mounted) _showSnackBar('Gagal mengambil lokasi');
    } finally {
      if (mounted) setState(() => _gettingLocation = false);
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await _controller.addNode(
      kodeNode: _kodeNodeController.text,
      label: _labelController.text,
      lat: _latController.text,
      lng: _lngController.text,
    );

    if (!mounted) return;

    if (success) {
      _showSnackBar('Node berhasil ditambahkan');
      Navigator.of(context).pop(true);
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final fieldsEnabled = _controller.kodeNodeValid;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Tambah Node',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildIntroCard(),
              const SizedBox(height: 18),

              Form(
                key: _formKey,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: cardDecoration(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Kode Node',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _kodeNodeController,
                              enabled: !_controller.checkingKode &&
                                  !_controller.submitting,
                              textCapitalization:
                                  TextCapitalization.characters,
                              textInputAction: TextInputAction.done,
                              onFieldSubmitted: (_) {
                                if (!_controller.checkingKode) {
                                  _handleCheckKodeNode();
                                }
                              },
                              decoration: InputDecoration(
                                hintText: 'Contoh: KN-12345',
                                prefixIcon:
                                    const Icon(Icons.memory_outlined),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  borderSide: const BorderSide(
                                    color: Color(0xFF2E7D32),
                                    width: 2,
                                  ),
                                ),
                              ),
                              validator: (value) {
                                if (value == null ||
                                    value.trim().isEmpty) {
                                  return 'Kode node wajib diisi';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          SizedBox(
                            height: 56,
                            child: FilledButton.icon(
                              onPressed:
                                  _controller.checkingKode ||
                                          _controller.submitting
                                      ? null
                                      : _handleCheckKodeNode,
                              style: FilledButton.styleFrom(
                                backgroundColor: const Color(0xFF2E7D32),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                              ),
                              icon: _controller.checkingKode
                                  ? const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2.5,
                                        color: Colors.white,
                                      ),
                                    )
                                  : const Icon(Icons.check_circle_outline),
                              label: const Text('Check'),
                            ),
                          ),
                        ],
                      ),
                      if (_controller.error != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          _controller.error!,
                          style: const TextStyle(
                            color: Colors.red,
                            fontSize: 13,
                          ),
                        ),
                      ],
                      if (_controller.kodeNodeValid) ...[
                        const SizedBox(height: 8),
                        const Row(
                          children: [
                            Icon(
                              Icons.verified,
                              color: Color(0xFF2E7D32),
                              size: 18,
                            ),
                            SizedBox(width: 6),
                            Text(
                              'Kode node valid',
                              style: TextStyle(
                                color: Color(0xFF2E7D32),
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],

                      const SizedBox(height: 20),
                      const Divider(),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _labelController,
                        enabled: fieldsEnabled && !_controller.submitting,
                        decoration: InputDecoration(
                          labelText: 'Label Node',
                          hintText: 'Contoh: Sawah 1',
                          prefixIcon: const Icon(Icons.grass_outlined),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: const BorderSide(
                              color: Color(0xFF2E7D32),
                              width: 2,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (!fieldsEnabled) return null;
                          if (value == null || value.trim().isEmpty) {
                            return 'Label node wajib diisi';
                          }
                          return null;
                        },
                      ),

                      const SizedBox(height: 16),

                      Row(
                        children: [
                          const Expanded(
                            child: Text(
                              'Lokasi Node',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          OutlinedButton.icon(
                            onPressed:
                                fieldsEnabled && !_controller.submitting
                                    ? _handleGetCurrentLocation
                                    : null,
                            icon: _gettingLocation
                                ? const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Color(0xFF2E7D32),
                                    ),
                                  )
                                : const Icon(
                                    Icons.my_location,
                                    size: 18,
                                  ),
                            label: Text(
                              _gettingLocation
                                  ? 'Mengambil...'
                                  : 'Gunakan Lokasi Saya',
                              style: const TextStyle(fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _latController,
                              enabled:
                                  fieldsEnabled && !_controller.submitting,
                              keyboardType: const TextInputType.numberWithOptions(
                                decimal: true,
                                signed: true,
                              ),
                              decoration: InputDecoration(
                                labelText: 'Latitude',
                                hintText: '-5.147665',
                                prefixIcon:
                                    const Icon(Icons.place_outlined),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  borderSide: const BorderSide(
                                    color: Color(0xFF2E7D32),
                                    width: 2,
                                  ),
                                ),
                              ),
                              validator: (value) {
                                if (!fieldsEnabled) return null;
                                if (value == null ||
                                    value.trim().isEmpty) {
                                  return 'Latitude wajib diisi';
                                }
                                if (double.tryParse(value.trim()) == null) {
                                  return 'Latitude tidak valid';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: TextFormField(
                              controller: _lngController,
                              enabled:
                                  fieldsEnabled && !_controller.submitting,
                              keyboardType: const TextInputType.numberWithOptions(
                                decimal: true,
                                signed: true,
                              ),
                              decoration: InputDecoration(
                                labelText: 'Longitude',
                                hintText: '119.432732',
                                prefixIcon:
                                    const Icon(Icons.public_outlined),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  borderSide: const BorderSide(
                                    color: Color(0xFF2E7D32),
                                    width: 2,
                                  ),
                                ),
                              ),
                              validator: (value) {
                                if (!fieldsEnabled) return null;
                                if (value == null ||
                                    value.trim().isEmpty) {
                                  return 'Longitude wajib diisi';
                                }
                                if (double.tryParse(value.trim()) == null) {
                                  return 'Longitude tidak valid';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: FilledButton.icon(
                          onPressed:
                              fieldsEnabled && !_controller.submitting
                                  ? _handleSubmit
                                  : null,
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF2E7D32),
                            disabledBackgroundColor: Colors.grey.shade300,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          icon: _controller.submitting
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    color: Colors.white,
                                  ),
                                )
                              : const Icon(Icons.save_outlined),
                          label: Text(
                            _controller.submitting
                                ? 'Menyimpan...'
                                : 'Simpan',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIntroCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: const Row(
        children: [
          Icon(Icons.add_circle_outline, color: Colors.white, size: 34),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Tambahkan Node Baru',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Masukkan kode node lalu klik Check untuk memastikan kode tersedia.',
                  style: TextStyle(color: Colors.white, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
