const express = require('express');
const router = express.Router();

const { getCartByUserId, addItemToCart } = require('../controllers/cart');
const { verify, isLoggedIn } = require('../auth');

const { updateCartQuantity } = require('../controllers/cart');
const { removeItemFromCart, clearCart } = require('../controllers/cart');

// Retrieve a user's cart
router.get('/get-cart', verify, isLoggedIn, getCartByUserId);

// Add item to cart
router.post('/add-to-cart', verify, isLoggedIn, addItemToCart);

// PATCH route to update product quantity in the cart
router.patch('/update-cart-quantity', verify, updateCartQuantity);

// Remove an item from the cart
router.patch('/:productId/remove-from-cart', verify, removeItemFromCart);

// Clear the entire cart
router.put('/clear-cart', verify, clearCart);

module.exports = router;