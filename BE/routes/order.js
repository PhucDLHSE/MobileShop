// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require("../middleware/adminAuth");
const {createOrder, updateOrderStatus, getAllOrders, getOrderByCode, deleteOrder } = require('../controllers/orderController');

router.post('/', auth, createOrder);

router.get('/', getAllOrders);

router.get('/:orderCode', getOrderByCode);

router.put('/:orderCode/status', auth, updateOrderStatus);

router.delete('/:orderCode', auth, adminAuth, deleteOrder);

module.exports = router;
