const mongoose = require("mongoose");

const rewardSchema = require("../schemas/rewardSchema");

const progressLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  value: {
    type: Number,
    required: true,
    default: 1,
  },
}, { _id: false });

const habitSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    required: true,
    default: "daily",
  },
  type: {
    type: String,
    enum: ["count", "cumulative"],
    required: true,
    default: "count",
  },
  target_value: {
    type: Number,
    required: true,
    default: 1
  },
  progress_log: {
    type: [progressLogSchema],
    default: [],
  },
  current_streak: {
    type: Number,
    default: 0,
  },
  last_reset: {
    type: Date,
    default: null
  },
  last_completed: {
    type: Date,
    default: null,
  },
  reward_per_completion: {
    type: rewardSchema,
    default: () => ({ xp: 0, coins: 0, stats: [] }),
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  linked_quest: {
    type: mongoose.ObjectId,
    ref: "Quest",
    default: null,
  },
}, { timestamps: true });

const HabitModel = mongoose.model("Habit", habitSchema);

module.exports = HabitModel;