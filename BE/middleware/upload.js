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

const deleteFromCloudinary = (imageUrl) => {
  const publicId = imageUrl.split("/").pop().split(".")[0];
  console.log("imageUrl", imageUrl);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(`${publicId}`, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

const upload = multer({ storage });

module.exports = { upload, deleteFromCloudinary };
