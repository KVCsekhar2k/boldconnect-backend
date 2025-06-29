const Ad = require('../models/adModel');
const Reel = require('../models/reelModel');
const User = require('../models/userModel');


// ✅ Get All Popular Reels
const getPopularReels = async (req, res) => {
  const reels = await Reel.find({ isPopular: true })
    .populate('user', 'name username email phone');
  res.json(reels);
};

// ✅ Reward a User (Mark Rewarded)
const rewardUser = async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) {
    res.status(404);
    throw new Error('Reel not found');
  }

  if (reel.rewarded) {
    res.status(400);
    throw new Error('Reward already given');
  }

  reel.rewarded = true;
  await reel.save();

  res.json({ message: 'Reward marked as given' });
};

// ✅ Ban a User
const banUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isBanned = true;
  await user.save();

  res.json({ message: 'User has been banned' });
};

// Create Advertisement
const createAd = async (req, res) => {
  const { title, image, link, description } = req.body;

  const ad = await Ad.create({
    title,
    image,
    link,
    description,
    createdBy: req.user._id,
  });

  res.status(201).json(ad);
};

// Get All Ads
const getAds = async (req, res) => {
  const ads = await Ad.find().sort({ createdAt: -1 });
  res.json(ads);
};

// Delete Ad
const deleteAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(404);
    throw new Error('Ad not found');
  }

  await ad.deleteOne();
  res.json({ message: 'Ad deleted' });
};

// Get All Users
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

module.exports = {
  createAd,
  getAds,
  deleteAd,
  getAllUsers,
  getPopularReels,
  rewardUser,
  banUser,
};
