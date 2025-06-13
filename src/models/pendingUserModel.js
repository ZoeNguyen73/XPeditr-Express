const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index on expiresAt (MongoDB auto-deletes after expiry)
pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingUserModel = mongoose.model("PendingUser", pendingUserSchema);

module.exports = PendingUserModel;