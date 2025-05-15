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
    if (!currentUserId) return res.status(401).json({ error: 'Không có quyền truy cập' });

    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).select('sender receiver');

    const contactIds = [
      ...new Set(
        messages.map(msg =>
          msg.sender.toString() === currentUserId.toString()
            ? msg.receiver.toString()
            : msg.sender.toString()
        )
      )
    ];

    const users = await User.find({ _id: { $in: contactIds } }).select(
      '_id username email avatar address'
    );

    const contactsWithLastMessage = await Promise.all(
      users.map(async user => {
        const lastMsg = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId }
          ]
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...user.toObject(),
          address: user.address || { name: '', lng: null, lat: null },
          lastMessage: lastMsg?.text || lastMsg?.content || null,
          lastMessageTime: lastMsg?.createdAt || null
        };
      })
    );

    res.status(200).json(contactsWithLastMessage);
  } catch (err) {
    console.error("Error fetching message contacts:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh bạ nhắn tin" });
  }
};

// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const { username, email, bio, gender, birthday, phone, role } = req.body;

//     // 👇 Parse address nếu là string
//     let address = req.body.address;
//     if (typeof address === 'string') {
//       try {
//         address = JSON.parse(address);
//       } catch (e) {
//         return res.status(400).json({ message: "Định dạng địa chỉ không hợp lệ" });
//       }
//     }

//     let avatarUrl = req.user.avatar;
//     if (req.file && req.file.path) {
//       avatarUrl = req.file.path;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         username,
//         email,
//         bio,
//         avatar: avatarUrl,
//         gender,
//         birthday,
//         phone,
//         address,
//         ...(role && { role })
//       },
//       { new: true }
//     ).select("-password");

//     if (!updatedUser) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({
//       message: "Cập nhật thông tin thành công",
//       updatedUser
//     });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
//   }
// };

// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const {
//       username,
//       email,
//       bio,
//       gender,
//       birthday,
//       phone,
//       role,  
//       grades,        
//       subjects      
//     } = req.body;

//     // 👇 Parse address nếu là string
//     let address = req.body.address;
//     if (typeof address === 'string') {
//       try {
//         address = JSON.parse(address);
//       } catch (e) {
//         return res.status(400).json({ message: "Định dạng địa chỉ không hợp lệ" });
//       }
//     }
//     //
//     const userInfor = await User.findById(userId);

//     let avatarUrl = userInfor.avatar;
//       let backgroundUrl = userInfor.backgroundImage;
//       if (req.files && req.files.avatar?.[0]) {
//         if (avatarUrl) await deleteFromCloudinary(avatarUrl);
//         avatarUrl = req.files.avatar?.[0].path;
//       }
//       if (req.files && req.files.backgroundImage?.[0]) {
//         if (backgroundUrl) await deleteFromCloudinary(backgroundUrl);
//         backgroundUrl = req.files.backgroundImage?.[0].path;
//       }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         username,
//         email,
//         bio,
//         avatar: avatarUrl,
//         gender,
//         birthday,
//         phone,
//         address,
//         backgroundImage: backgroundUrl,
//         grades: Array.isArray(grades) ? grades : [],
//         subjects: Array.isArray(subjects) ? subjects : [],
//         ...(role && { role })
//       },
//       { new: true }
//     ).select("-password");

//     if (!updatedUser) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({
//       message: "Cập nhật thông tin thành công",
//       updatedUser
//     });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
//   }
// };
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
      subjects
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

    // ✅ Sửa đúng chỗ này: dùng req.files
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
      gender
    } = req.query;

    // 👉 Nếu người dùng là học sinh thì tìm gia sư, ngược lại thì tìm học sinh
    const targetRole = currentUser.role === "student" ? "tutor" : "student";

    const query = {
      role: targetRole
    };

    if (username && username.trim() !== "") {
      query.username = { $regex: username.trim(), $options: "i" };
    }

    if (address && address.trim() !== "") {
      query["address.name"] = { $regex: address.trim(), $options: "i" };
    }

    if (grade && grade.trim() !== "") {
      query.grades = grade;
    }

    if (subject && subject.trim() !== "") {
      query.subjects = subject;
    }

    if (gender && ["male", "female", "other"].includes(gender)) {
      query.gender = gender;
    }

    const users = await User.find(query).select("-password");

    // Đảm bảo address luôn có định dạng đầy đủ
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

// Tính khoảng cách giữa hai điểm địa lý
function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in km
}

// Gợi ý người dùng
exports.suggestUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const targetRole = currentUser.role === 'student' ? 'tutor' : 'student';

    const candidates = await User.find({
      role: targetRole,
      subjects: { $in: currentUser.subjects },
      grades: { $in: currentUser.grades }
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
      .slice(0, 5); // lấy top 5 gần nhất

    res.json(suggestions.map(s => s.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};