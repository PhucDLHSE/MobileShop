const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Tạo mới Brand
router.post('/', auth, adminAuth, brandController.createBrand);

// Lấy tất cả Brands
router.get('/', auth, brandController.getBrands);

// Lấy một Brand theo ID
router.get('/:id', auth, brandController.getBrandById);

// Cập nhật Brand
router.put('/:id', auth, adminAuth, brandController.updateBrand);

// Xóa Brand
router.delete('/:id', auth, adminAuth, brandController.deleteBrand);

module.exports = router;
