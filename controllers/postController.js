const Post = require('../models/postModel');

// Create Post
const createPost = async (req, res) => {
  const { caption } = req.body;
  const image = req.file.path;

  const post = await Post.create({
    user: req.user._id,
    caption,
    image,
  });

  res.status(201).json(post);
};


// Get All Posts
const getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('user', 'name username profilePic')
    .sort({ createdAt: -1 });

  res.json(posts);
};

// Like/Unlike Post
const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const index = post.likes.indexOf(req.user._id);

  if (index === -1) {
    post.likes.push(req.user._id);
    await post.save();
    res.json({ message: 'Post liked' });
  } else {
    post.likes.splice(index, 1);
    await post.save();
    res.json({ message: 'Post unliked' });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};

module.exports = { createPost, getAllPosts, likePost, deletePost };
