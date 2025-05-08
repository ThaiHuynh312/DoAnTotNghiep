const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true },
}, { timestamps: true });

messageSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;  
    return ret;
  }
});

module.exports = mongoose.model('Message', messageSchema);
