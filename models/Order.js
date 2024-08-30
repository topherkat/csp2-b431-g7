const mongoose = require('mongoose');

// [Section] Order
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is Required']
    },
    productsOrdered: {
        type: [orderItemSchema],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);