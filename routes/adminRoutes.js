const express = require('express');
const router = express.Router();
const {
  createAd,
  getAds,
  deleteAd,
  getAllUsers,
  getPopularReels,
  rewardUser,
  banUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ads', protect, createAd);
router.get('/ads', protect, getAds);
router.delete('/ads/:id', protect, deleteAd);
router.get('/users', protect, getAllUsers);
// ✅ Get Popular Reels
router.get('/popular-reels', protect, getPopularReels);

// ✅ Reward a User
router.put('/reward/:id', protect, rewardUser);

// ✅ Ban a User
router.put('/ban/:id', protect, banUser);

module.exports = router;
