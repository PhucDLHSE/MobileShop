const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require("../middleware/adminAuth");
const {createOrder, updateOrderStatus, getAllOrders, getOrdersByUserId, getOrderByCode, deleteOrder } = require('../controllers/orderController');

router.post('/', auth, createOrder);

router.get('/all', auth, adminAuth, getAllOrders);

router.get('/user', auth, getOrdersByUserId);

router.get('/:orderCode', getOrderByCode);

router.put('/:orderCode/status', auth, updateOrderStatus);

router.delete('/:orderCode', auth, adminAuth, deleteOrder);

module.exports = router;
