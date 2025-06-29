const mongoose = require('mongoose');

const reelSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    videoUrl: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isPopular: { type: Boolean, default: false }, // ✅ Track Popular Status
    rewarded: { type: Boolean, default: false },  // ✅ Whether reward given
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reel', reelSchema);
