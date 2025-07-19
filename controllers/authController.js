const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register User
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, phone, password } = req.body;

    if (!name || !username || !email || !phone || !password) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400);
      throw new Error('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// Login User
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.isBanned) {
        res.status(403); // Forbidden
        throw new Error('This account has been banned.');
      }

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
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
