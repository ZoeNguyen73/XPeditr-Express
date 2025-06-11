const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["habit", "quest", "reward", "companion", "level-up", "punishment"],
    required: true,
  },
  change: {
    xp: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
    stats: {
      type: [{
        stat_id: {
          type: mongoose.ObjectId,
          ref: "Stat",
          required: true,
        },
        value: {
          type: Number,
          default: 0,
        },
      }],
      default: [],
    },
  },
  linked_quest: {
    type: mongoose.ObjectId,
    ref: "Quest",
  },
  linked_task: {
    type: mongoose.ObjectId,
    ref: "Task",
  },
  linked_habit: {
    type: mongoose.ObjectId,
    ref: "Habit",
  },
}, { timestamps: true });

const LogEntryModel = mongoose.model("LogEntry", logEntrySchema);

module.exports = LogEntryModel;