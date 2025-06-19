const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isActivated: { type: Boolean, default: false },
});

const PendingUserModel = mongoose.model("PendingUser", pendingUserSchema);

module.exports = PendingUserModel;