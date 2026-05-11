const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All
router.post('/register', authController.register);
router.post('/login', authController.login);

router.put('/reset-password', authMiddleware, authController.resetPassword);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);

// Belum Fix
router.put('/forgot-password', authMiddleware, authController.forgotPasword);


module.exports = router;
