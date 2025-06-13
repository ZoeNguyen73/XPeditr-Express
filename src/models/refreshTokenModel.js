const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: { type: Date, required: true },
});

// TTL index on expiresAt (MongoDB auto-deletes after expiry)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshTokenModel;