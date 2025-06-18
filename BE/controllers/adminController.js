const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Report = require("../models/Report");
const Post = require('../models/Post');
const Message = require('../models/Message');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        status: "error",
        message: "Email và mật khẩu là bắt buộc",
        data: null,
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
        data: null,
      });

    if (user.role !== "admin")
      return res.status(403).json({
        status: "error",
        message: "Chỉ admin mới được phép đăng nhập",
        data: null,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        status: "error",
        message: "Email hoặc mật khẩu không đúng",
        data: null,
      });

    const access_token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refresh_token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      status: "success",
      message: "Đăng nhập thành công",
      data: {
        access_token,
        refresh_token,
      },
    });
  } catch (err) {
    console.error("Error adminLogin:", err);
    res.status(500).json({
      status: "error",
      message: "Lỗi máy chủ",
      data: null,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalReports = await Report.countDocuments();
    const activeTutors = await User.countDocuments({ role: 'tutor', searchable: true });
    const totalMessages = await Message.countDocuments();

    res.json({
      message: 'Thống kê dashboard',
      data: {
        'Tổng người dùng': totalUsers,
        'Tổng bài viết': totalPosts,
        'Tổng báo cáo': totalReports,
        'Gia sư đang bật tìm kiếm': activeTutors,
        'Tổng tin nhắn': totalMessages,
      },
    });
  } catch (err) {
    console.error('Lỗi lấy thống kê dashboard:', err);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      data: null,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User status updated", user });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

const getReports = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate("reporter", "username email avatar")
      .populate("targetUser", "username email avatar")
      .populate("targetPost")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!["pending", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Invalid report status" });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    )
      .populate("reporter", "username email avatar")
      .populate("targetUser", "username email avatar")
      .populate("targetPost");

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ message: "Report status updated", report });
  } catch (err) {
    console.error("Error updating report status:", err);
    res.status(500).json({ message: "Failed to update report status" });
  }
};

module.exports = {
    adminLogin,
    getUsers,
    updateUserStatus,
    getReports,
    updateReportStatus,
    getDashboardStats,
};
