const mongoose = require("mongoose");

const statObjectSchema = new mongoose.Schema({
  stat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stat",
    required: true,
  },
  value: {
    type: Number,
    required: true,
    default: 0,
  },
}, { _id: false });

module.exports = statObjectSchema;