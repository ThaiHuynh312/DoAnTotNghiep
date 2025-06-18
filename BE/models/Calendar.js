const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },

  start: { type: Date },
  end: { type: Date },

  startTime: {
    type: Date,
    required: function () {
      return this.repeat?.type !== 'none';
    },
  },
  endTime: {
    type: Date,
    required: function () {
      return this.repeat?.type !== 'none';
    },
  },

  repeat: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
    from: { type: Date },              
    to: { type: Date },      
    daysOfWeek: Number,       
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
