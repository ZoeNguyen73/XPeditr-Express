const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon_url: {
    type: String,
    required: true,
  },
  description: { 
    type: String, 
    default: "", 
  },
}, { timestamps: true });

const ClassModel = mongoose.model("Class", classSchema);

module.exports = ClassModel;