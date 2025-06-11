const mongoose = require("mongoose");

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
    enum: ["pet", "npc"],
    required: true,
  },
  icon_url: {
    type: String,
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