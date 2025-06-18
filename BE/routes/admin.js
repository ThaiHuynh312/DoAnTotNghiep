const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/auth"); 

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Forbidden" });
};
router.post("/login", adminController.adminLogin);

router.use(authenticate); 
router.use(isAdmin); 

router.get("/users", adminController.getUsers);
router.patch("/users/:userId/status", adminController.updateUserStatus);

router.get("/reports", adminController.getReports);
router.patch("/reports/:reportId/status", adminController.updateReportStatus);
router.get("/dashboard/stats", authenticate, adminController.getDashboardStats);

module.exports = router;
