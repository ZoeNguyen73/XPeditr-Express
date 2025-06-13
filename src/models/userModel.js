const mongoose = require("mongoose");

const statObjectSchema = require("../schemas/statObjectSchema");
const classInfoSchema = require("../schemas/classInfoSchema");

const { AVATAR_OPTIONS } = require("../config/constants");

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
    enum: AVATAR_OPTIONS,
    required: true,
    default: "1a",
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
    default: null,
  },
  companions: {
    type: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "UserCompanion", 
    }],
    default: [],
  },
  needs_profile_update: {
    type: Boolean,
    required: true,
    default: true,
  }
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;