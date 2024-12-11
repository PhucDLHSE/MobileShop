const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Tạo mới Brand
router.post('/', auth, adminAuth, brandController.createBrand);

// Lấy tất cả
router.get('/', auth, brandController.getBrands);

// Lấy theo ID
router.get('/:id', auth, brandController.getBrandById);

// Cập nhật 
router.put('/:id', auth, adminAuth, brandController.updateBrand);

// Xóa 
router.delete('/:id', auth, adminAuth, brandController.deleteBrand);

module.exports = router;
