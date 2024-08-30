const Product = require('../models/Product');

// Create a new product
module.exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all products
module.exports.getAllProducts = async (req, res) => {
    try {
        // Example check for user authentication, customize as needed
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                auth: "Failed",
                message: "Action Forbidden"
            });
        }

        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve all active products
module.exports.getActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true });
        res.status(200).json(activeProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a single product by ID
module.exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Product Info (Admin Only)
module.exports.updateProductInfo = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                auth: "Failed",
                message: "Action Forbidden"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Archive Product (Admin Only)
module.exports.archiveProduct = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                auth: "Failed",
                message: "Action Forbidden"
            });
        }

        const archivedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { isActive: false },
            { new: true }
        );

        if (!archivedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product archived successfully', product: archivedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Activate Product (Admin Only)
module.exports.activateProduct = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                auth: "Failed",
                message: "Action Forbidden"
            });
        }

        const activatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { isActive: true },
            { new: true }
        );

        if (!activatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product activated successfully', product: activatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search products by name
module.exports.searchByName = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Product name is required' });
    }

    try {
        const products = await Product.find({ name: new RegExp(name, 'i') });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Search products by price range
module.exports.searchByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
        return res.status(400).json({ message: 'Both minimum and maximum prices are required' });
    }

    try {
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

