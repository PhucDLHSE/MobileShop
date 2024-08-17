const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Thêm sản phẩm vào giỏ hàng
router.post('/add', auth, cartController.addProductToCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove', auth, cartController.removeProductFromCart);

// Xem tất cả sản phẩm trong giỏ hàng
router.get('/', auth, cartController.viewCart);

module.exports = router;
