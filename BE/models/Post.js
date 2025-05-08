const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  content: { type: String, required: true },
  images: [{ type: String }], 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true }); 

module.exports = mongoose.model('Post', postSchema);
