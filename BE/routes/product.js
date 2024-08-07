const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Tạo mới Product
router.post('/', auth, adminAuth, productController.createProduct);

// Lấy tất cả Products
router.get('/', auth, productController.getProducts);

// Lấy một Product theo ID
router.get('/:id', auth, productController.getProductById);

// Cập nhật Product
router.put('/:id', auth, adminAuth, productController.updateProduct);

// Xóa Product
router.delete('/:id', auth, adminAuth, productController.deleteProduct);

module.exports = router;
