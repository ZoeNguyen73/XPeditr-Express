const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: { 
    type: String, 
    default: "", 
  },
}, { timestamps: true });

const StatModel = mongoose.model("Stat", statSchema);

module.exports = StatModel;