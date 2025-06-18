const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/auth");
const {upload} = require("../middleware/upload"); 
const { getReports, createReport } = require("../controllers/reportController");

router.get("/", getReports);
router.post("/", authenticate, upload.array("images", 10), createReport);

module.exports = router;
