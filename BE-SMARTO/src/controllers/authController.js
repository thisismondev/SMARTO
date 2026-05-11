const User = require('../models/User');
const { signToken } = require('../utils/jwt');

// Register
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validasi input
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        status: false,
        message: 'Username, email, role, and password are required',
      });
    }

    const existingUser = await User.findExistingByUsernameOrEmail(username, email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: false,
        message: 'Username or email already exists',
      });
    }

    // Insert user baru
    await User.create({
      roleId: role,
      username,
      email,
      password,
    });

    return res.status(201).json({
      status: true,
      message: 'Registration successful',
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      status: false,
      message: err.message,
      error: err,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validasi input
    if (!identifier || !password) {
      return res.status(400).json({
        status: false,
        message: 'Identifier (username/email) and password are required',
      });
    }

    const user = await User.findByIdentifier(identifier);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid credentials',
      });
    }

    // Cek password (plaintext comparison)
    if (user.password !== password) {
      return res.status(401).json({
        status: false,
        message: 'Invalid credentials',
      });
    }

    // Cek status user
    if (user.status !== 0) {
      return res.status(403).json({
        status: false,
        message: 'User account is not active',
      });
    }

    // Generate token
    const token = signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      roleId: user.role_id,
    });

    return res.status(200).json({
      status: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      message: 'Logout successful',
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validasi input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: 'All fields are required',
      });
    }

    // Cek password sama
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: 'Password confirmation does not match',
      });
    }

    // Cek user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    if (user.password !== oldPassword) {
      return res.status(400).json({
        status: false,
        message: 'Old password is incorrect',
      });
    }

    // Update password
    await User.updatePassword(userId, newPassword);

    return res.status(200).json({
      status: true,
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error('Reset password error:', err);

    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

const forgotPasword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validasi
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: 'All fields are required',
      });
    }

    // Konfirmasi password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: 'Password confirmation does not match',
      });
    }

    // Cek email
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'Email not found',
      });
    }

    // Update password
    await User.updatePasswordByEmail(email, newPassword);

    return res.status(200).json({
      status: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    console.error('Forgot password error:', err);

    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

// Get current user (untuk verifikasi token, optional)
const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      data: req.user,
    });
  } catch (err) {
    console.error('Get current user error:', err);
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  resetPassword,
  forgotPasword,
  getCurrentUser,
};
