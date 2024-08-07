const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Tạo mới Category
router.post('/', auth, adminAuth, categoryController.createCategory);

// Lấy tất cả Categories
router.get('/', auth, categoryController.getCategories);

// Lấy một Category theo ID
router.get('/:id', auth, categoryController.getCategoryById);

// Cập nhật Category
router.put('/:id', auth, adminAuth, categoryController.updateCategory);

// Xóa Category
router.delete('/:id', auth, adminAuth, categoryController.deleteCategory);

module.exports = router;
