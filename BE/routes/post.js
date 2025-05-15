const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getMyPosts, getPostsUser, updatePost, deletePost, likePost } = require("../controllers/postController");
const authenticate = require("../middleware/auth");
const {upload} = require("../middleware/upload"); 

router.post("/", authenticate, upload.array("images", 10), createPost);
router.get("/user/:userId", authenticate, getPostsUser);
router.get("/me", authenticate, getMyPosts);  
router.get("/", authenticate, getAllPosts);
router.put("/:id", authenticate, upload.array("images", 10), updatePost);
router.delete("/:id", authenticate, deletePost);
router.post("/:id/like", authenticate, likePost);


module.exports = router;
