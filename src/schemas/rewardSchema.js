const mongoose = require("mongoose");

const statsRewardSchema = new mongoose.Schema({
  stat_id: {
    type: mongoose.ObjectId,
    ref: "Stat",
    required: true,
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
}, { _id: false });

const rewardSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  stats: { type: [statsRewardSchema], default: [] },
  // items: { type: [mongoose.ObjectId], ref: "Item", default: [] },
  // buffs: { type: [mongoose.ObjectId], ref: "Buff", default: [] },
}, { _id: false });

module.exports = rewardSchema;