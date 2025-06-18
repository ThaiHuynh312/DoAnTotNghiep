const Schedule = require("../models/Calendar");

exports.createSchedule = async (req, res) => {
  try {
    const {
      title,
      description,
      start,
      end,
      startTime,
      endTime,
      repeat
    } = req.body;

    const finalStartTime = startTime || start;
    const finalEndTime = endTime || end;

    if (!finalStartTime || !finalEndTime) {
      return res.status(400).json({ message: "Thiếu thời gian bắt đầu hoặc kết thúc" });
    }

    let repeatData = { type: "none" };

    if (repeat && repeat.type && repeat.type !== "none") {
      if (!repeat.daysOfWeek || !repeat.from || !repeat.to) {
        return res.status(400).json({ message: "Thông tin lặp lại không đầy đủ (cần daysOfWeek, from, to)" });
      }

      repeatData = {
        type: repeat.type,
        daysOfWeek: repeat.daysOfWeek,
        from: new Date(repeat.from),
        to: new Date(repeat.to),
      };
    }

    const schedule = new Schedule({
      user: req.user._id,
      title,
      description,
      startTime: new Date(finalStartTime),
      endTime: new Date(finalEndTime),
      repeat: repeatData,
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    console.error("Lỗi tạo lịch:", err);
    res.status(500).json({ message: "Tạo lịch thất bại" });
  }
};

exports.getMySchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user._id }).sort({ startTime: 1 });
    res.status(200).json(schedules);
  } catch (err) {
    console.error("Lỗi lấy lịch:", err);
    res.status(500).json({ message: "Lấy lịch thất bại" });
  }
};

// 👉 Lấy lịch theo ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!schedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch" });
    }

    res.status(200).json(schedule);
  } catch (err) {
    console.error("Lỗi lấy lịch theo ID:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { title, description, start, end, startTime, endTime, repeat } = req.body;

    const finalStartTime = startTime || start;
    const finalEndTime = endTime || end;

    if (!finalStartTime || !finalEndTime) {
      return res.status(400).json({ message: "Thiếu thời gian bắt đầu hoặc kết thúc" });
    }

    if (new Date(finalEndTime) <= new Date(finalStartTime)) {
      return res.status(400).json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu" });
    }

    let repeatData = { type: "none" };

    if (repeat && repeat.type && repeat.type !== "none") {
      if (!repeat.daysOfWeek || !repeat.from || !repeat.to) {
        return res.status(400).json({ message: "Thông tin lặp lại không đầy đủ (cần daysOfWeek, from, to)" });
      }

      repeatData = {
        type: repeat.type,
        daysOfWeek: repeat.daysOfWeek,
        from: new Date(repeat.from),
        to: new Date(repeat.to),
      };
    }

    const updated = await Schedule.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        description,
        startTime: new Date(finalStartTime),
        endTime: new Date(finalEndTime),
        repeat: repeatData,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy lịch để cập nhật" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi cập nhật lịch:", err);
    res.status(500).json({ message: "Cập nhật lịch thất bại" });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy lịch để xoá" });
    }

    res.status(200).json({ message: "Xoá lịch thành công" });
  } catch (err) {
    console.error("Lỗi xoá lịch:", err);
    res.status(500).json({ message: "Xoá lịch thất bại" });
  }
};

exports.getSchedulesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const schedules = await Schedule.find({ user: userId }).sort({ startTime: 1 });
    res.status(200).json(schedules);
  } catch (err) {
    console.error("Lỗi lấy lịch người dùng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().sort({ startTime: 1 });
    res.status(200).json(schedules);
  } catch (err) {
    console.error("Lỗi lấy tất cả lịch:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};