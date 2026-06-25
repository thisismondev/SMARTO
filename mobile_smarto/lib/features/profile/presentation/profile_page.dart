import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F8F4),
      appBar: AppBar(
        title: const Text(
          'Profil',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF2E7D32),
                    Color(0xFF66BB6A),
                  ],
                ),
                borderRadius: BorderRadius.circular(22),
              ),
              child: const Column(
                children: [
                  CircleAvatar(
                    radius: 42,
                    backgroundColor: Colors.white,
                    child: Icon(
                      Icons.person,
                      size: 48,
                      color: Color(0xFF2E7D32),
                    ),
                  ),
                  SizedBox(height: 14),
                  Text(
                    'Petani SMARTO',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Pengguna Aplikasi Mobile SMARTO',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            _ProfileSection(
              title: 'Informasi Akun',
              children: const [
                _ProfileItem(
                  icon: Icons.badge_outlined,
                  label: 'Nama',
                  value: 'Petani SMARTO',
                ),
                _ProfileItem(
                  icon: Icons.person_outline,
                  label: 'Username',
                  value: 'petani',
                ),
                _ProfileItem(
                  icon: Icons.email_outlined,
                  label: 'Email',
                  value: 'petani@example.com',
                ),
                _ProfileItem(
                  icon: Icons.verified_user_outlined,
                  label: 'Role',
                  value: 'PETANI',
                ),
              ],
            ),

            const SizedBox(height: 16),

            _ProfileSection(
              title: 'Informasi Lahan',
              children: const [
                _ProfileItem(
                  icon: Icons.grass_outlined,
                  label: 'Lahan',
                  value: 'Lahan Kedelai 1',
                ),
                _ProfileItem(
                  icon: Icons.memory_outlined,
                  label: 'Kode Node',
                  value: 'KN-12345',
                ),
                _ProfileItem(
                  icon: Icons.location_on_outlined,
                  label: 'Lokasi',
                  value: 'Makassar, Sulawesi Selatan',
                ),
              ],
            ),

            const SizedBox(height: 16),

            _ProfileSection(
              title: 'Tentang Aplikasi',
              children: const [
                _ProfileItem(
                  icon: Icons.eco_outlined,
                  label: 'Aplikasi',
                  value: 'SMARTO',
                ),
                _ProfileItem(
                  icon: Icons.info_outline,
                  label: 'Deskripsi',
                  value: 'Smart Monitoring Kedelai',
                ),
                _ProfileItem(
                  icon: Icons.app_settings_alt_outlined,
                  label: 'Versi',
                  value: '1.0.0',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _ProfileSection({
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }
}

class _ProfileItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _ProfileItem({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 22,
            color: const Color(0xFF2E7D32),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
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