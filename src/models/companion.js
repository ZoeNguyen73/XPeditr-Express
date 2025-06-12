const mongoose = require("mongoose");

const { COMPANION_TYPES } = require("../config/constants");

const companionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  evolved_from: {
    type: mongoose.ObjectId,
    default: null,
  },
  type: {
    type: String,
    enum: COMPANION_TYPES,
    required: true,
  },
  description: { 
    type: String, 
    default: "", 
  },
  perks: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  species: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const CompanionModel = mongoose.model("Companion", companionSchema);

module.exports = CompanionModel;