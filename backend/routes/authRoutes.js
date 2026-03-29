const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
      res.json({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed admin
router.post('/seed', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      const admin = new User({
        email: 'admin@shop.com',
        password: hashedPassword,
        isAdmin: true,
      });
      await admin.save();
      res.status(201).json({ message: 'Admin seeded successfully' });
    } else {
      res.status(400).json({ message: 'Admin already seeded' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
