const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const auth = require('../auth'); 

// [POST] /orders/checkout - Create a new order
router.post('/checkout', auth.verify, orderController.createOrder);

// Route to retrieve user's orders
router.get('/my-orders', auth.verify, orderController.getMyOrders);

// Route to retrieve all orders (admin only)
router.get('/all-orders', auth.verify, auth.verifyAdmin, orderController.getAllOrders);

module.exports = router;