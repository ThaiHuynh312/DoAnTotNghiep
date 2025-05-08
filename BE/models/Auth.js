const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
