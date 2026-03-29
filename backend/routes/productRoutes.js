const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, brand, size, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (size) query.sizes = size;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .lean();

    res.json({
      products,
      page: currentPage,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
