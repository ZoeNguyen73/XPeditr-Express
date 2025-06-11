const mongoose = require("mongoose");

const rewardSchema = require("../schemas/rewardSchema")

const taskSchema = new mongoose.Schema({
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
  is_completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  completed_at: {
    type: Date,
    default: null
  },
  rewards: {
    type: rewardSchema,
    default: () => ({ xp: 0, coins: 0, stats: [] }),
  },
  linked_quest: {
    type: mongoose.ObjectId,
    ref: "Quest",
    default: null,
  },
}, { timestamps: true });

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = TaskModel;