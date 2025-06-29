const Message = require('../models/messageModel');

// Send Message
const sendMessage = async (req, res) => {
  const { receiver, content } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    receiver,
    content,
  });

  res.status(201).json(message);
};

// Get Messages Between Users
const getMessages = async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
};

module.exports = { sendMessage, getMessages };
