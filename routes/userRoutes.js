const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);

module.exports = router;
