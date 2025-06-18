const { deleteFromCloudinary } = require("../middleware/upload");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const User = require('../models/User'); 
const axios = require('axios');


const subjectKeywords = ["Toán", "Lý", "Hóa", "Văn", "Anh", "Sinh", "Sử", "Địa", "GDCD"];
const gradeNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

const normalizeSubjects = (entities) => {
  return entities
    .filter(e => e.label === 'MONHOC')
    .map(e => {
      const text = e.text.trim().toLowerCase();
      const matched = subjectKeywords.find(subject =>
        subject.toLowerCase() === text
      );
      return matched || null;
    })
    .filter(Boolean);
};

const normalizeGrades = (entities) => {
  return entities
    .filter(e => e.label === 'LOP')
    .map(e => {
      const text = e.text.trim().toLowerCase();
      const match = text.match(/\d{1,2}/); 
      if (match) {
        const num = parseInt(match[0]);
        if (gradeNumbers.includes(num)) {
          return `Lớp ${num}`;
        }
      }
      return null;
    })
    .filter(Boolean);
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const deg2rad = deg => deg * (Math.PI / 180);
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;
    const images = req.files?.map(file => file.path) || [];

    const nerResponse = await axios.post('http://localhost:5001/ner', { text: content });
    const entities = nerResponse.data.entities || [];
    const subjects = normalizeSubjects(entities);
    const grades = normalizeGrades(entities);

    const newPost = await Post.create({
      creator: userId,
      content,
      images,
      subjects,
      grades,
    });

    const student = await User.findById(userId);
    if (!student || !student.address?.lat || !student.address?.lng) {
      return res.status(201).json({
        message: "Post created (but student location missing)",
        post: newPost,
      });
    }

    const studentLat = student.address.lat;
    const studentLng = student.address.lng;

    const tutors = await User.find({
      role: 'tutor',
      subjects: { $in: subjects },
      grades: { $in: grades },
      'address.lat': { $exists: true },
      'address.lng': { $exists: true }
    });

    const tutorsInRange = tutors.filter(tutor => {
      const { lat, lng } = tutor.address;
      return getDistanceFromLatLonInKm(studentLat, studentLng, lat, lng) <= 15;
    });

    const notifications = tutorsInRange.map(tutor => ({
      user: tutor._id,
      fromUser: userId,
      post: newPost._id,
      type: 'post',
      isRead: false,
      createdAt: new Date(),
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      message: "Post created and suggestions sent to tutors",
      post: newPost,
      suggestedTutors: tutorsInRange.map(t => ({
        _id: t._id,
        name: t.name,
        email: t.email,
        distance: getDistanceFromLatLonInKm(studentLat, studentLng, t.address.lat, t.address.lng).toFixed(1) + ' km'
      }))
    });

  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("creator", "username email avatar") 
        .populate("comments.user", "username avatar") 
        .sort({ createdAt: -1 }); 
  
      res.status(200).json({
        message: "Fetched all posts successfully",
        posts,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.getMyPosts = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const posts = await Post.find({ creator: userId })
        .sort({ createdAt: -1 }) 
        .populate("creator", "username avatar");
  
      res.status(200).json({ posts });
    } catch (error) {
      console.error("Error getting my posts:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.getPostsUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId" });
      }
  
      if (!req.user) {
        return res.status(401).json({ message: "Chưa xác thực người dùng" });
      }
  
      const posts = await Post.find({ creator: userId })
        .sort({ createdAt: -1 })
        .populate("creator", "username avatar");
  
      return res.status(200).json({ posts });
    } catch (error) {
      console.error("Error getting user's posts:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  };

exports.updatePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const { content } = req.body;

    const keptImages = Array.isArray(req.body.keptImages)
      ? req.body.keptImages
      : req.body.keptImages
      ? [req.body.keptImages] 
      : [];

    const newImages = req.files?.map(file => file.path) || [];

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.creator.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

    const imagesToDelete = post.images.filter(img => !keptImages.includes(img));
    for (const img of imagesToDelete) {
      await deleteFromCloudinary(img);
    }

    if (content) post.content = content;
    post.images = [...keptImages, ...newImages];

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  exports.deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.creator.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    await Notification.deleteMany({ post: postId });

    res.status(200).json({ message: "Post and related notifications deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

  exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post không tồn tại" });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      await post.save();

      await Notification.deleteOne({
        user: post.creator,
        fromUser: userId,
        post: postId,
        type: "like"
      });

      return res.status(200).json({
        message: "Đã bỏ like",
        likesCount: post.likes.length,
        likedUsers: post.likes,
      });
    } else {
      post.likes.push(userId);
      await post.save();

      if (post.creator.toString() !== userId.toString()) { 
        await Notification.create({
          user: post.creator,
          fromUser: userId,
          post: postId,
          type: "like"
        });
      }

      return res.status(200).json({
        message: "Đã like bài viết",
        likesCount: post.likes.length,
        likedUsers: post.likes,
      });
    }

  } catch (error) {
    console.error("Lỗi like bài viết:", error);
    res.status(500).json({ message: "Lỗi server khi xử lý like" });
  }
};