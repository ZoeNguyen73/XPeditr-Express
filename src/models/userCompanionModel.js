const mongoose = require("mongoose");

const userCompanionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  companion_id: {
    type: mongoose.ObjectId,
    ref: "Companion",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  morale_rating: {
    type: Number,
    required: true,
    default: 30,
    min: 0,
    max: 100,
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  acquired_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

userCompanionSchema.index({ user_id: 1, companion_id: 1}, { unique: true });

const UserCompanionModel = mongoose.model("UserCompanion", userCompanionSchema);

module.exports = UserCompanionModel;