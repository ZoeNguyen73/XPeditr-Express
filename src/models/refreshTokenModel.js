const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshTokenModel;