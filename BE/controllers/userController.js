const mongoose = require("mongoose");
const User = require('../models/User');
const Message = require('../models/Message');
const { deleteFromCloudinary } = require('../middleware/upload');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      address: user.address || { name: '', lng: null, lat: null }
    }));
    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách người dùng" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Không có quyền truy cập" });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const formattedUser = {
      ...user.toObject(),
      address: user.address || { name: '', lng: null, lat: null }
    };

    res.status(200).json(formattedUser);
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const formattedUser = {
      ...user.toObject(),
      address: user.address || { name: '', lng: null, lat: null }
    };

    res.status(200).json(formattedUser);
  } catch (err) {
    console.error("Error in getUser:", err);
    res.status(500).json({ message: "Lỗi server khi lấy người dùng theo ID" });
  }
};

exports.getMessageContacts = async (req, res) => {
  try {
    const currentUserId = req.user?._id;
    if (!currentUserId) {
      return res.status(401).json({ error: "Không có quyền truy cập" });
    }

    const currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);

    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserObjectId },
            { receiver: currentUserObjectId },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          sender: 1,
          receiver: 1,
          content: 1,
          text: 1,
          createdAt: 1,
          contactId: {
            $cond: {
              if: { $eq: ["$sender", currentUserObjectId] },
              then: "$receiver",
              else: "$sender",
            },
          },
        },
      },
      {
        $group: {
          _id: "$contactId",
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    const contactIds = lastMessages.map((msg) => msg._id);

    const users = await User.find({ _id: { $in: contactIds } }).select(
      "_id username email avatar address"
    );

    const contacts = lastMessages.map((msg) => {
      const user = users.find((u) => u._id.toString() === msg._id.toString());
      return {
        _id: user?._id,
        username: user?.username,
        email: user?.email,
        avatar: user?.avatar,
        address: user?.address || { name: "", lat: null, lng: null },
        lastMessage: msg.lastMessage || "",
        lastMessageTime: msg.lastMessageTime || null,
      };
    });

    res.status(200).json(contacts);
  } catch (err) {
    console.error("Lỗi khi lấy danh bạ nhắn tin:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh bạ nhắn tin" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const {
      username,
      email,
      bio,
      gender,
      birthday,
      phone,
      role,
      grades,
      subjects,
      pricePerHour,
      education,
      experience,
      searchable
    } = req.body;

    let address = req.body.address;
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address);
      } catch (e) {
        return res.status(400).json({ message: "Định dạng địa chỉ không hợp lệ" });
      }
    }

    const userInfor = await User.findById(userId);
    let avatarUrl = userInfor.avatar;
    let backgroundUrl = userInfor.backgroundImage;

    if (req.files?.avatar?.[0]) {
      if (avatarUrl) await deleteFromCloudinary(avatarUrl);
      avatarUrl = req.files.avatar[0].path;
    }

    if (req.files?.backgroundImage?.[0]) {
      if (backgroundUrl) await deleteFromCloudinary(backgroundUrl);
      backgroundUrl = req.files.backgroundImage[0].path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        bio,
        avatar: avatarUrl,
        gender,
        birthday,
        phone,
        address,
        backgroundImage: backgroundUrl,
        grades: Array.isArray(grades) ? grades : [],
        subjects: Array.isArray(subjects) ? subjects : [],
        ...(role && { role }),
        pricePerHour,
        education,
        experience,
        searchable,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });

    const {
      username,
      address,
      grade,
      subject,
      gender,
      role,
      priceMin,
      priceMax,
      education,
      experience
    } = req.query;

    const query = {
      searchable: { $ne: false },
      role: { $ne: "admin" }
    };

    if (role && ["student", "tutor"].includes(role)) {
      query.role = role;
    }

    if (username && username.trim() !== "") {
      query.username = { $regex: username.trim(), $options: "i" };
    }

    if (address && address.trim() !== "") {
      query["address.name"] = { $regex: address.trim(), $options: "i" };
    }

    if (grade && grade.trim() !== "") {
      const gradesArray = grade.split(",").map(g => g.trim());
      query.grades = { $in: gradesArray };
    }

    if (subject && subject.trim() !== "") {
      const subjectsArray = subject.split(",").map(s => s.trim());
      query.subjects = { $in: subjectsArray };
    }

    if (gender && ["male", "female", "other"].includes(gender)) {
      query.gender = gender;
    }

    if (priceMin || priceMax) {
      query.pricePerHour = {};
      if (priceMin) query.pricePerHour.$gte = Number(priceMin);
      if (priceMax) query.pricePerHour.$lte = Number(priceMax);
    }

    if (education && education.trim() !== "") {
      query.education = { $regex: education.trim(), $options: "i" };
    }

    if (experience && experience.trim() !== "") {
  query.experience = experience.trim();
}

    const users = await User.find(query).select("-password");

    const formattedUsers = users.map(user => ({
      ...user.toObject(),
      address: user.address || { name: "", lng: null, lat: null }
    }));

    res.status(200).json({ users: formattedUsers });

  } catch (err) {
    console.error("Lỗi tìm kiếm người dùng:", err);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm người dùng" });
  }
};

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

exports.suggestUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const targetRole = currentUser.role === 'student' ? 'tutor' : 'student';

    const candidates = await User.find({
      role: targetRole,
      subjects: { $in: currentUser.subjects },
      grades: { $in: currentUser.grades },
      searchable: { $ne: false },
    });

    const suggestions = candidates
      .map(user => {
        const distance = user.address?.lat && user.address?.lng
          ? haversineDistance(
              currentUser.address.lat,
              currentUser.address.lng,
              user.address.lat,
              user.address.lng
            )
          : Infinity;
        return { user, distance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); 

    res.json(suggestions.map(s => s.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleSearchable = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newSearchable = !user.searchable;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { searchable: newSearchable },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: `Chế độ tìm kiếm đã được ${newSearchable ? "bật" : "tắt"}`,
      searchable: updatedUser.searchable
    });
  } catch (err) {
    console.error("Lỗi khi bật/tắt tìm kiếm:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật searchable" });
  }
};
