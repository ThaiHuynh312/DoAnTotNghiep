const User = require('../models/User');
const Message = require('../models/Message');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
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

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.status(200).json(user);
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
      '_id username email avatar'
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

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { username, email, bio, gender, birthday, phone, address, role } = req.body;

    let avatarUrl = req.user.avatar;

    if (req.file && req.file.path) {
      avatarUrl = req.file.path;
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
        ...(role && { role }) 
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      updatedUser
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
  }
};
