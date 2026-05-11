const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.patch('/users/:userId/update', authMiddleware, userController.updateUser);

//1 dan 2
router.get('/users', authMiddleware, roleMiddleware('PENYULUH'), userController.fetchUsers);

// Admin
router.put('/users/:userId/inactive', authMiddleware, roleMiddleware('ADMIN', 'PENYULUH'), userController.inactiveUsers);
// Soft Delete account
router.get('/admin/users', authMiddleware, roleMiddleware('ADMIN'), userController.adminFetchUsers);
router.put('/admin/users/:userId/active', authMiddleware, roleMiddleware('ADMIN'), userController.activeUsers);

router.patch('/admin/users/:userId/update', authMiddleware, roleMiddleware('ADMIN'), userController.adminUpdateUser);

module.exports = router;
