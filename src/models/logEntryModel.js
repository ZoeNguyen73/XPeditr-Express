const mongoose = require("mongoose");

// Stat changes
const statChangeSchema = new mongoose.Schema({
  stat_id: {
    type: mongoose.ObjectId,
    ref: "Stat",
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
}, { _id: false });

/* tentative for future

// Item changes
const itemChangeSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
}, { _id: false });

// Badge changes
const badgeSchema = new mongoose.Schema({
  badge_id: {
    type: mongoose.ObjectId,
    ref: "Badge",
    required: true,
  },
}, { _id: false });

// Buff/effect
const buffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  duration_ms: {
    type: Number,
    required: true, // in milliseconds
  },
  effect_type: {
    type: String,
    enum: ["xp", "coin", "stat", "custom"],
    required: true,
  },
  effect_value: {
    type: Number,
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
}, { _id: false });

// Quest chain tracking
const questChainSchema = new mongoose.Schema({
  chain_id: {
    type: mongoose.ObjectId,
    ref: "QuestChain",
    required: true,
  },
  stage: {
    type: Number,
    required: true,
  },
}, { _id: false });

*/

const logEntrySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "habit", "quest", "reward", "companion",
      "level-up", "punishment", "inventory",
      "badge", "buff", "quest-chain", "timed-event"
    ],
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
    level: Number,
    stats: {
      type: [statChangeSchema],
      default: [],
    },
    /*items: {
      type: [itemChangeSchema],
      default: [],
    },
    badges: {
      type: [badgeSchema],
      default: [],
    },
    buffs: {
      type: [buffSchema],
      default: [],
    },
    quest_chain: {
      type: questChainSchema,
      default: null,
    },*/
    duration_ms: Number, // used for cooldowns or timed actions
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
  notes: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const LogEntryModel = mongoose.model("LogEntry", logEntrySchema);

module.exports = LogEntryModel;