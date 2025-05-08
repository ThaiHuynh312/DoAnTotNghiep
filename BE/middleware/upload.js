const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    upload_preset: "upload-tutor-finder",
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

const upload = multer({ storage });

module.exports = upload;
