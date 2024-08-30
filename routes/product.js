const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const auth = require("../auth");

// Create a product
router.post('/', productController.createProduct);

// Retrieve all products
router.get('/all', auth.verify, productController.getAllProducts);

// Retrieve all active products
router.get('/active', productController.getActiveProducts);

// Retrieve a single product by ID
router.get('/:productId', auth.verify, productController.getProductById);

// Update product info (Admin only)
router.patch('/:productId/update', auth.verify, productController.updateProductInfo);

// Archive product (Admin only)
router.patch('/:productId/archive', auth.verify, productController.archiveProduct);

// Activate product (Admin only)
router.patch('/:productId/activate', auth.verify, productController.activateProduct);

// Add search for products by name
router.post('/search-by-name', productController.searchByName);

// Add search for products by price range
router.post('/search-by-price', productController.searchByPrice);

module.exports = router;