const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/auth"); 

router.post("/login", adminController.adminLogin);

router.get("/users", adminController.getUsers);
router.patch("/users/:userId/status", adminController.updateUserStatus);

router.get("/reports", adminController.getReports);
router.patch("/reports/:reportId/status", adminController.updateReportStatus);
router.get("/dashboard/stats", adminController.getDashboardStats);
router.get("/reported-posts", adminController.getReportedPosts);
router.patch("/posts/:postId/status", authenticate, adminController.updatePostStatus);

module.exports = router;
