const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Route công khai để lấy tất cả sản phẩm
router.get('/public', productController.getPublicProducts);

// Route công khai để lấy sản phẩm theo Category
router.get('/public/category/:categoryId', productController.getPublicProductsByCategory);

// Route công khai để tìm kiếm sản phẩm
router.get('/search', productController.searchPublicProducts);

// Các route yêu cầu xác thực vẫn giữ nguyên
router.post('/', auth, adminAuth, productController.createProduct);
router.get('/', auth, productController.getProducts);
router.get('/:id', auth, productController.getProductById);
router.put('/:id', auth, adminAuth, productController.updateProduct);
router.delete('/:id', auth, adminAuth, productController.deleteProduct);

module.exports = router;