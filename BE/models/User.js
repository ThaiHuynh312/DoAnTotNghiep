const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" }, 
  bio: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female", "other"], default: "male" },
  birthday: { type: Date }, 
  phone: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["student", "tutor"],
    default: "student"
  }
});

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;  
    delete ret.password;  
    return ret;
  }
});

module.exports = mongoose.model("Users", userSchema);
