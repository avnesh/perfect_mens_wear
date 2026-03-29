const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', protect, admin, async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting(req.body);
      await setting.save();
      return res.json(setting);
    }
    
    Object.assign(setting, req.body);
    const updatedSetting = await setting.save();
    res.json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
