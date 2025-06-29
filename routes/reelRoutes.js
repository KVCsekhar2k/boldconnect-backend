const express = require('express');
const router = express.Router();
const { createReel, getAllReels, likeReel, increaseViews, deleteReel } = require('../controllers/reelController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(protect, getAllReels)
  .post(protect, upload.single('videoUrl'), createReel);

router.put('/like/:id', protect, likeReel);
router.put('/view/:id', protect, increaseViews);
router.delete('/:id', protect, deleteReel);

module.exports = router;
