const Cart = require('../models/Cart');

// Retrieve a user's cart
module.exports.getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add item to cart
module.exports.addItemToCart = async (req, res) => {
    const { productId, quantity, subtotal } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                cartItems: [{ productId, quantity, subtotal }],
                totalPrice: subtotal
            });
        } else {
            const existingItemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
            if (existingItemIndex > -1) {
                cart.cartItems[existingItemIndex].quantity += quantity;
                cart.cartItems[existingItemIndex].subtotal += subtotal;
            } else {
                cart.cartItems.push({ productId, quantity, subtotal });
            }
            cart.totalPrice += subtotal;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update cart quantity
module.exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id; // Obtained from the JWT middleware
        const { productId, quantity, subtotal } = req.body;

        // Find the cart for the current user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if the product is already in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            // Update the quantity and subtotal
            cart.cartItems[itemIndex].quantity = quantity;
            cart.cartItems[itemIndex].subtotal = subtotal;
        } else {
            // Add the new product to the cart
            cart.cartItems.push({ productId, quantity, subtotal });
        }

        // Recalculate the total price
        cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// Remove item from cart
module.exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // Find the cart for the current user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if the product is in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

        if (itemIndex > -1) {
            // Remove the item from the cart
            cart.cartItems.splice(itemIndex, 1);

            // Recalculate the total price
            cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

            // Save the updated cart
            await cart.save();

            return res.status(200).json({ message: 'Item removed from cart', cart });
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

// Clear cart
module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the cart for the current user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Clear the cart items and reset the total price
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};