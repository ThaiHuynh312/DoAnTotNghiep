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
  backgroundImage: { type: String, default: "" },
  grades: { type: [String], default: [] },
  subjects: { type: [String], default: [] }, 
  role: {
    type: String,
    enum: ["student", "tutor","admin"],
    default: "student"
  },
  address: {
    name: { type: String },
    lng: { type: Number },
    lat: { type: Number }
  },
  searchable: { type: Boolean, default: true }, 
  pricePerHour: { type: Number, default: 0 }, 
  education: { type: String, default: "" }, 
  experience: { type: String, default: "" }, 
  status: { 
  type: String, 
  enum: ["active", "blocked"], 
  default: "active" 
  },
});

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model("Users", userSchema);