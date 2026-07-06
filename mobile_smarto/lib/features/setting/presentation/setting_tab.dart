import 'package:flutter/material.dart';

import '../../../../app/router.dart';
import '../controller/logout_controller.dart';
import '../controller/account_controller.dart';

class SettingTab extends StatefulWidget {
  const SettingTab({super.key});

  @override
  State<SettingTab> createState() => _SettingTabState();
}

class _SettingTabState extends State<SettingTab> with AutomaticKeepAliveClientMixin {
  final LogoutController logoutController = LogoutController();
  final AccountController accountController = AccountController();

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();

    logoutController.addListener(() {
      if (mounted) {
        setState(() {});
      }
    });

    accountController.addListener(() {
      if (mounted) {
        setState(() {});
      }
    });

    accountController.loadAccount();
  }

  @override
  void dispose() {
    logoutController.dispose();
    accountController.dispose();
    super.dispose();
  }

  Future<void> handleLogout() async {
    final success = await logoutController.logout();

    if (!mounted) return;

    if (success) {
      Navigator.pushReplacementNamed(context, AppRouter.login);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(logoutController.error ?? 'Gagal logout')),
      );
    }
  }

  void showResetPasswordDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Reset Password'),
          content: const Text(
            'Fitur reset password masih dummy. Nanti bisa diarahkan ke halaman ubah password.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Tutup'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.pop(context);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Fitur reset password belum tersedia'),
                  ),
                );
              },
              child: const Text('Lanjut'),
            ),
          ],
        );
      },
    );
  }

  void showLogoutConfirm(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Logout'),
          content: const Text('Apakah Anda yakin ingin keluar dari aplikasi?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Batal'),
            ),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: Colors.red),
              onPressed: logoutController.loading
                  ? null
                  : () async {
                      Navigator.pop(context);
                      await handleLogout();
                    },
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _ProfileHeader(
            name: accountController.displayName,
          ),

          const SizedBox(height: 18),

          _SettingSection(
            title: 'Akun',
            children: [
              _SettingTile(
                icon: Icons.person_outline,
                title: 'Profil',
                subtitle: 'Lihat informasi akun petani',
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Halaman profil masih dummy')),
                  );
                },
              ),
              const Divider(height: 1),
              _SettingTile(
                icon: Icons.lock_reset_outlined,
                title: 'Reset Password',
                subtitle: 'Ubah atau reset password akun',
                onTap: () {
                  showResetPasswordDialog(context);
                },
              ),
            ],
          ),

          const SizedBox(height: 16),

          _SettingSection(
            title: 'Informasi Akun',
            children: [
              _InfoTile(
                icon: Icons.badge_outlined,
                title: 'Username',
                value: accountController.displayUsername,
              ),
              Divider(height: 1),
              _InfoTile(
                icon: Icons.email_outlined,
                title: 'Email',
                value: accountController.displayEmail,
              ),
              Divider(height: 1),
              _InfoTile(
                icon: Icons.verified_user_outlined,
                title: 'Role',
                value: accountController.displayRole,
              ),
            ],
          ),

          const SizedBox(height: 16),

          const _SettingSection(
            title: 'Aplikasi',
            children: [
              _InfoTile(
                icon: Icons.eco_outlined,
                title: 'Nama Aplikasi',
                value: 'SMARTO',
              ),
              Divider(height: 1),
              _InfoTile(
                icon: Icons.info_outline,
                title: 'Versi',
                value: '1.0.0',
              ),
            ],
          ),

          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            height: 52,
            child: OutlinedButton.icon(
              onPressed: () {
                showLogoutConfirm(context);
              },
              icon: const Icon(Icons.logout),
              label: const Text(
                'Logout',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red,
                side: const BorderSide(color: Colors.red),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  final String name;

  const _ProfileHeader({
    required this.name
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2E7D32), Color(0xFF66BB6A)],
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 44,
            backgroundColor: Colors.white,
            child: Icon(Icons.person, size: 50, color: Color(0xFF2E7D32)),
          ),
          SizedBox(height: 14),
          Text(
            name,
            style: TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Pengguna Aplikasi Mobile SMARTO',
            style: TextStyle(color: Colors.white, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _SettingSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SettingSection({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              title,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
            ),
          ),
          ...children,
        ],
      ),
    );
  }
}

class _SettingTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SettingTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: const Color(0xFFE8F5E9),
        child: Icon(icon, color: const Color(0xFF2E7D32)),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _InfoTile({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: const Color(0xFFE8F5E9),
        child: Icon(icon, color: const Color(0xFF2E7D32)),
      ),
      title: Text(
        title,
        style: const TextStyle(color: Colors.black54, fontSize: 13),
      ),
      subtitle: Text(
        value,
        style: const TextStyle(
          color: Colors.black87,
          fontWeight: FontWeight.bold,
          fontSize: 15,
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
