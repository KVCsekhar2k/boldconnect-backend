const Reel = require('../models/reelModel');
const User = require('../models/userModel');


// Create Reel
const createReel = async (req, res) => {
  const { caption, videoUrl } = req.body;

  const reel = await Reel.create({
    user: req.user._id,
    caption,
    videoUrl,
  });

  res.status(201).json(reel);
};

// Get All Reels
const getAllReels = async (req, res) => {
  const reels = await Reel.find()
    .populate('user', 'name username profilePic')
    .sort({ createdAt: -1 });

  res.json(reels);
};

// Like/Unlike Reel
const likeReel = async (req, res) => {
  const reel = await Reel.findById(req.params.id);

  if (!reel) {
    res.status(404);
    throw new Error('Reel not found');
  }

  const index = reel.likes.indexOf(req.user._id);

  if (index === -1) {
    reel.likes.push(req.user._id);
    await reel.save();
    res.json({ message: 'Reel liked' });
  } else {
    reel.likes.splice(index, 1);
    await reel.save();
    res.json({ message: 'Reel unliked' });
  }
};

// ✅ Increase Views and Check Popularity
const increaseViews = async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error('Reel not found');
  }

  // Basic Anti-Fraud Logic (Can expand later)
  if (reel.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot view your own reel for views');
  }

  reel.views += 1;

  // ✅ Mark Popular if views >= 100,000 and not already marked
  if (reel.views >= 100000 && !reel.isPopular) {
    reel.isPopular = true;
  }

  await reel.save();
  res.json({ message: 'View counted' });
};


// Delete Reel
const deleteReel = async (req, res) => {
  const reel = await Reel.findById(req.params.id);

  if (!reel) {
    res.status(404);
    throw new Error('Reel not found');
  }

  if (reel.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await reel.deleteOne();
  res.json({ message: 'Reel deleted' });
};

module.exports = { createReel, getAllReels, likeReel, increaseViews, deleteReel };
