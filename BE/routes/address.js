const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middleware/auth');

// Set API thêm địa chỉ mới
router.post('/', auth, addressController.createAddress);

// Lấy tất cả Địa chỉ của một User
router.get('/', auth, addressController.getAddresses);

// Xóa Địa chỉ
router.delete('/:id', auth, addressController.deleteAddress);

//Cập nhật địa chỉ Mặc định
router.put('/:id/set-default', auth, addressController.setDefaultAddress);


module.exports = router;
