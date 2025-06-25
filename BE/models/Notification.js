const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, 
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, 
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, 
  type: { type: String, enum: ["like", "block", "post"], required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
