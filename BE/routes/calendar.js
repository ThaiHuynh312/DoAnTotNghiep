const express = require("express");
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getMySchedules,
  getSchedulesByUser,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/calendarController");
const authenticate = require("../middleware/auth");

router.post("/", authenticate, createSchedule);
router.get("/user/:userId", authenticate, getSchedulesByUser);
router.get("/me", authenticate, getMySchedules);
router.get("/", authenticate, getAllSchedules);
router.get("/:id", authenticate, getScheduleById);
router.put("/:id", authenticate, updateSchedule);
router.delete("/:id", authenticate, deleteSchedule);

module.exports = router;
