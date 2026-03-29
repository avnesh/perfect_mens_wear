const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// Get Dashboard Stats
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue (only from Delivered orders, or simplify to all non-cancelled)
    const revenueCalc = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueCalc.length > 0 ? revenueCalc[0].totalSales : 0;

    // Get last 7 days of orders for charts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format recent orders beautifully for recharts
    // Create an array for the last 7 days even if no orders exist
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const dayData = recentOrders.find(r => r._id === dateString);
      last7Days.push({
        date: dateString,
        orders: dayData ? dayData.orders : 0,
        revenue: dayData ? dayData.revenue : 0
      });
    }

    res.json({
      summary: {
        products: totalProducts,
        categories: totalCategories,
        orders: totalOrders,
        revenue: totalRevenue
      },
      chartData: last7Days
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
