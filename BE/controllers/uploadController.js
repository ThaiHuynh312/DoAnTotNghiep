exports.uploadImage = (req, res) => {
    try {
      const imageUrl = req.file.path; 
  
      res.status(200).json({
        message: "Upload successful",
        imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  