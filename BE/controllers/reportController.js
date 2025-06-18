const Report = require("../models/Report");

const createReport = async (req, res) => {
  try {
    const { type, reason, targetUser, targetPost } = req.body;

    if (!type || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reporter = req.user._id;

    const imageUrls = req.files?.map(file => file.path || file.url) || [];

    const report = new Report({
      reporter,
      type,
      reason,
      targetUser: type === "user" ? targetUser : null,
      targetPost: type === "post" ? targetPost : null,
      images: imageUrls, 
    });

    await report.save();
    res.status(201).json({ message: "Report submitted", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getReports = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate("reporter", "username email avatar")
      .populate("targetUser", "username email avatar")
      .populate("targetPost")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

module.exports = {
  createReport,
  getReports,
};
