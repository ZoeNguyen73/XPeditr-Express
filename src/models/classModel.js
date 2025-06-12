const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
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

const ClassModel = mongoose.model("Class", classSchema);

module.exports = ClassModel;