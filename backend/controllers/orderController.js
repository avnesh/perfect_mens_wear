const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = async (req, res, next) => {
  try {
    const { products, customerDetails, paymentType, totalAmount } = req.body;

    if (products && products.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        products,
        user: req.user ? req.user._id : undefined,
        customerDetails,
        paymentType,
        totalAmount,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Pagination implemented)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Newest first
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean(); // Faster query

    res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  getOrders,
};
