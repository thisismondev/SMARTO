const User = require('../models/User');

const adminUpdateUser = async (req, res) => {
  try {
    // id user target dari URL
    const userId = req.params.id;

    const { username, email, role_id, status, password, confirmPassword } = req.body;
    const currentUser = req.user;

    // cek role admin
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({
        status: false,
        message: 'Access denied',
      });
    }

    // cek user target ada atau tidak
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    // 3. Cek duplicate username/email
    if (username || email) {
      const existingUser = await User.findExistingByUsernameOrEmail(username || user.username, email || user.email, userId);

      if (existingUser.length > 0) {
        return res.status(400).json({
          status: false,
          message: 'Username or email already exists',
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role_id) updateData.role_id = role_id;
    if (status !== undefined) updateData.status = status; // Pakai check undefined karena status bisa bernilai 0

    // 4. Logika Khusus Password (Hanya diproses jika password diisi)
    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({
          status: false,
          message: 'Confirm password does not match',
        });
      }
      // Pastikan method di model menghandle hashing password
      updateData.password = password;
    }

    // 5. Validasi: Pastikan ada data yang dikirim untuk diupdate
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'No fields provided for update',
      });
    }

    await User.update(userId, updateData);

    return res.status(200).json({
      status: true,
      message: 'User updated successfully',
      updatedFields: Object.keys(updateData), // Opsional: mengembalikan list field apa saja yang berubah
    });
  } catch (err) {
    console.error('Admin update user error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    // id user target dari URL
    const userId = req.params.id;

    const { username, email } = req.body;
    const currentUser = req.user;

    // Cek user target ada atau tidak
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    // Cek duplicate username/email
    if (username || email) {
      const existingUser = await User.findExistingByUsernameOrEmail(username || user.username, email || user.email, userId);

      if (existingUser.length > 0) {
        return res.status(400).json({
          status: false,
          message: 'Username or email already exists',
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    // Validasi: Pastikan ada data yang dikirim untuk diupdate
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'No fields provided for update',
      });
    }

    // Update user
    await User.update(userId, updateData);

    return res.status(200).json({
      status: true,
      message: 'User updated successfully',
      updatedFields: Object.keys(updateData),
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

// Active account
const activeUsers = async (req, res) => {
  try {
    // 1. Pastikan nama parameter sesuai dengan yang ada di routes (misal: /:id)
    const userId = req.params.userId;

    // DEBUGGING: Cek apakah ID benar-benar terisi dari URL
    console.log('Target User ID untuk diaktifkan:', userId);

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: 'Parameter ID tidak ditemukan di URL',
      });
    }

    // 2. Eksekusi fungsi dari model dan simpan hasilnya di dalam variabel
    const result = await User.activeById(userId);

    // DEBUGGING: Cek hasil balikan dari database
    console.log('Hasil dari DB:', result);

    // 3. Cek apakah ada baris yang benar-benar terupdate
    // (Tergantung library DB Anda, biasanya ada properti affectedRows)
    if (result && result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: 'Gagal mengaktifkan. User tidak ditemukan.',
      });
    }

    // 4. Jika lolos pengecekan, berarti benar-benar sukses terupdate
    return res.status(200).json({
      status: true,
      message: 'User activated successfully',
    });
  } catch (err) {
    console.error('Active user error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: err.message || err,
    });
  }
};

// Non Active account (hanya admin)
const inactiveUsers = async (req, res) => {
  try {
    // Ambil ID dari URL params
    const userId = req.params.userId;

    // Pengecekan role admin (jika belum di-handle sepenuhnya oleh middleware)
    // const currentUser = req.user;
    // if (currentUser && currentUser.role !== 'ADMIN') {
    //   return res.status(403).json({
    //     status: false,
    //     message: 'Access denied. Admin only.',
    //   });
    // }

    // Eksekusi fungsi inactiveById dari model (mengubah status menjadi 1)
    await User.inactiveById(userId);

    return res.status(200).json({
      status: true,
      message: 'User deactivated successfully', // Pesan disesuaikan
    });
  } catch (err) {
    console.error('Inactive user error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: err.message || err,
    });
  }
};

// Mengambil daftar user aktif (status = 0)
const fetchUsers = async (req, res) => {
  try {
    // Panggil model findUsers
    const users = await User.findUsers();

    return res.status(200).json({
      status: true,
      message: 'Daftar user berhasil diambil',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan internal pada server',
    });
  }
};

// Mengambil semua daftar user lengkap dengan password (hanya admin)
const adminFetchUsers = async (req, res) => {
  try {
    // Pengecekan role admin
    const currentUser = req.user;
    if (currentUser && currentUser.role !== 'ADMIN') {
      return res.status(403).json({
        status: false,
        message: 'Access denied. Admin only.',
      });
    }

    // Panggil model adminFindUsers
    const users = await User.adminFindUsers();

    return res.status(200).json({
      status: true,
      message: 'Daftar seluruh user berhasil diambil',
      data: users,
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan internal pada server',
    });
  }
};

module.exports = {
  adminUpdateUser,
  updateUser,
  activeUsers,
  inactiveUsers,
  adminFetchUsers,
  fetchUsers,
};
