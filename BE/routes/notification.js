const express = require("express");
const router = express.Router();
const { getNotifications, markNotificationRead } = require("../controllers/notificationController");
const authenticate = require("../middleware/auth");

router.use(authenticate);

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);

module.exports = router;
