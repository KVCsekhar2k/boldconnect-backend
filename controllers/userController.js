const User = require('../models/userModel');

// Get User Profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      profilePic: user.profilePic,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.profilePic = req.body.profilePic || user.profilePic;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// Follow User
const followUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.followers.includes(req.user._id)) {
    user.followers.push(req.user._id);
    currentUser.following.push(user._id);

    await user.save();
    await currentUser.save();

    res.json({ message: 'User followed' });
  } else {
    res.status(400);
    throw new Error('Already following this user');
  }
};

// Unfollow User
const unfollowUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.followers.includes(req.user._id)) {
    user.followers = user.followers.filter(
      (follower) => follower.toString() !== req.user._id.toString()
    );
    currentUser.following = currentUser.following.filter(
      (following) => following.toString() !== user._id.toString()
    );

    await user.save();
    await currentUser.save();

    res.json({ message: 'User unfollowed' });
  } else {
    res.status(400);
    throw new Error('Not following this user');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
};
