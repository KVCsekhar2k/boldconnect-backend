const Post = require('../models/postModel');
const cloudinary = require('../config/cloudinary');
const compressImage = require('../utils/imageCompressor');
const compressVideo = require('../utils/videoCompressor');
const path = require('path');

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required." });
    }

    let compressedPath = '';
    let uploadedResult = {};

    // Compress based on file type
    if (req.file.mimetype.startsWith('image/')) {
      compressedPath = `uploads/compressed-${Date.now()}-${req.file.filename}`;
      await compressImage(req.file.path, compressedPath);

      uploadedResult = await cloudinary.uploader.upload(compressedPath, {
        folder: 'posts',
        resource_type: 'image',
      });

    } else if (req.file.mimetype.startsWith('video/')) {
      compressedPath = `uploads/compressed-${Date.now()}-${req.file.filename}`;
      await compressVideo(req.file.path, compressedPath);

      uploadedResult = await cloudinary.uploader.upload(compressedPath, {
        folder: 'posts',
        resource_type: 'video',
      });

    } else {
      return res.status(400).json({ message: "Unsupported file type." });
    }

    // Create Post Entry
    const post = await Post.create({
      user: req.user._id,
      caption,
      fileUrl: uploadedResult.secure_url || compressedPath,
      fileType: req.file.mimetype,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (err) {
    console.error("Error uploading post:", err);
    res.status(500).json({ message: "Server Error while uploading post." });
  }
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
