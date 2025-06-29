const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, likePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(protect, getAllPosts)
  .post(protect, upload.single('image'), createPost);

router.put('/like/:id', protect, likePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
