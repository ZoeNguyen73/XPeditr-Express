const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["minor", "major"],
    required: true,
    default: "minor",
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
  parent_quest: {
    type: mongoose.ObjectId,
    ref: "Quest",
    default: null,
    index: true,
  },
  due_date: {
    type: Date,
    default: null
  },
}, { timestamps: true });

const QuestModel = mongoose.model("Quest", questSchema);

module.exports = QuestModel;