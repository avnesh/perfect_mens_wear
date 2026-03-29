const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find({}).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const item = new Gallery(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (item) {
      res.json({ message: 'Gallery item removed' });
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generic Upload Route using Cloudinary
// Note: We use upload.array to allow multiple uploads
router.post('/upload', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    const imageUrls = req.files.map(file => file.path);
    res.json({ urls: imageUrls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
