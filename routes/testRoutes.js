// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

router.get('/cloudinary-test', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cloudinary connection failed', error: error.message });
  }
});

module.exports = router;
