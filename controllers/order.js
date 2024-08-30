const Cart = require('../models/Cart');
const Order = require('../models/Order');
const auth = require('../auth'); 

// [SECTION] Create Order
module.exports.createOrder = async (req, res) => {
    try {
        // 1. Get userId from the verified token (req.user is set by auth middleware)
        const userId = req.user.id;

        // 2. Find the cart for the user
        const userCart = await Cart.findOne({ userId: userId });
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // 3. Check if the cart contains items
        if (userCart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 4. Create the order
        const newOrder = new Order({
            userId: userId,
            productsOrdered: userCart.cartItems,
            totalPrice: userCart.totalPrice
        });

        // 5. Save the order
        await newOrder.save();

        // 6. Send response back to the client
        res.status(201).json({
            message: "Order created successfully",
            orderId: newOrder._id
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "An error occurred while creating the order",
            error: error.message
        });
    }
};

// Retrieve user's orders
module.exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is set by your auth middleware
        
        const orders = await Order.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving orders.', error: error.message });
    }
};

// Retrieve all orders (admin only)
module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while retrieving orders.', error: error.message });
    }
};
