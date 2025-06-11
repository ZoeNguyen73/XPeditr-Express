const mongoose = require("mongoose");

const statObjectSchema = new mongoose.Schema({
  stat_id: {
    type: mongoose.ObjectId,
    ref: "Stat",
    required: true,
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
});

const classInfoSchema = new mongoose.Schema({
  current: {
    type: mongoose.ObjectId,
    ref: "Class",
    required: true,
  },
  secondary: {
    type: mongoose.ObjectId,
    ref: "Class",
    required: false,
    default: null,
  },
  subclass: {
    type: mongoose.ObjectId,
    ref: "Class",
    required: false,
    default: null,
  },
  history: {
    type: [{
      class_id: {
        type: mongoose.ObjectId,
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
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: "cat",
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  xp: {
    type: Number,
    required: true,
    default: 0,
  },
  coins: {
    type: Number,
    required: true,
    default: 0,
  },
  stats: {
    type: [statObjectSchema],
    required: true,
    default: [],
  },
  class_info: {
    type: classInfoSchema,
    default: null
  },
  companions: {
    type: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "UserCompanion" 
    }],
    default: [],
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;