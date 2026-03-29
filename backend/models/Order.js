const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest checkout
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        size: { type: String, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['COD', 'WhatsApp'],
      default: 'COD',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
