// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllOrders, createOrder, getOrderByCode } = require('../controllers/orderController');

router.post('/', auth, createOrder);

router.get('/', getAllOrders);

router.get('/:orderCode', getOrderByCode);

module.exports = router;
