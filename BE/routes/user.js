const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserById, getAllUsers, deleteUser, updateUserById, createUserByAdmin, blockUser, unblockUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

//User: Lấy và cập nhật thông tin cá nhân
router.get('/me', auth, getUserProfile); // Lấy thông tin cá nhân
router.put('/me', auth, updateUserProfile); // Cập nhật thông tin cá nhân

//Admin: Quản lý user
router.get('/:id', auth, adminAuth, getUserById); // Lấy thông tin của 1 user
router.get('/', auth, adminAuth, getAllUsers); // Lấy danh sách tất cả user
router.delete('/:id', auth, adminAuth, deleteUser); // Xóa user
router.put('/:id', auth, adminAuth, updateUserById); // Cập nhật thông tin của 1 user
router.post('/create', auth, adminAuth, createUserByAdmin); // Tạo tài khoản mới 

router.put('/block/:userId', blockUser); // Chặn tài khoản
router.put('/unblock/:userId', unblockUser); // Mở khóa tài khoản


module.exports = router;
