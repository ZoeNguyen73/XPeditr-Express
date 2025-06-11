const mongoose = require("mongoose");

const classInfoSchema = new mongoose.Schema({
  current: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  secondary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null,
  },
  subclass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    default: null,
  },
  history: {
    type: [{
      class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
      acquired_at: {
        type: Date,
        required: true,
      },
    }],
    default: [],
  },
}, { _id: false });

module.exports = classInfoSchema;