const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'post'],
    required: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  targetPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  reason: {
    type: String,
    required: true,
  },
  images: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['pending', 'resolve', 'dismiss'],
    default: 'pending',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
