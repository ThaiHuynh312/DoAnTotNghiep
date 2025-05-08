const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;
    const images = req.files?.map(file => file.path) || [];

    const newPost = await Post.create({
      creator: userId,
      content,
      images,
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost
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
      const images = req.files?.map(file => file.path) || [];
  
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      if (!post.creator.equals(userId)) {
        return res.status(403).json({ message: "Unauthorized to update this post" });
      }
  
      if (content) post.content = content;
      if (images.length > 0) post.images = images;
  
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
  
      res.status(200).json({ message: "Post deleted successfully" });
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
      } else {
        post.likes.push(userId);
      }
  
      await post.save();
  
      res.status(200).json({
        message: hasLiked ? "Đã bỏ like" : "Đã like bài viết",
        likesCount: post.likes.length,
        likedUsers: post.likes,
      });
    } catch (error) {
      console.error("Lỗi like bài viết:", error);
      res.status(500).json({ message: "Lỗi server khi xử lý like" });
    }
  };