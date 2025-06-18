const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("fromUser", "username avatar") 
      .populate({
        path: "post",
        populate: [
          { path: "creator", select: "username avatar" },
          {
            path: "comments.user",
            select: "username avatar"
          }
        ]
      });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) return res.status(404).json({ message: "Thông báo không tồn tại" });

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Đã đánh dấu thông báo là đã đọc" });
  } catch (error) {
    console.error("Lỗi đánh dấu thông báo:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
