const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // người nhận
    type: { type: String, enum: ["message", "like", "comment"], required: true },
    content: { type: String }, // VD: "User A đã gửi tin nhắn", "User B đã like bài viết"
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ai tạo thông báo
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // nếu là like hoặc comment
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
