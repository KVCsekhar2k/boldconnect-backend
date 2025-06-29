const Comment = require('../models/commentModel');

// Add Comment
const addComment = async (req, res) => {
  const { postId, reelId, text } = req.body;

  const comment = await Comment.create({
    user: req.user._id,
    post: postId || undefined,
    reel: reelId || undefined,
    text,
  });

  res.status(201).json(comment);
};

// Get Comments for a Post or Reel
const getComments = async (req, res) => {
  const { id, type } = req.params;

  const filter = type === 'post' ? { post: id } : { reel: id };

  const comments = await Comment.find(filter)
    .populate('user', 'name username profilePic')
    .sort({ createdAt: -1 });

  res.json(comments);
};

module.exports = { addComment, getComments };
