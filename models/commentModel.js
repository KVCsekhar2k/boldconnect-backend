const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel' },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
