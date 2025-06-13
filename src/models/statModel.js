const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: { 
    short_description: {
      type: String,
      default: ""
    },
    example_life_habits: {
      type: [String],
      default: "",
    },
    tooltip_text: {
      type: String,
      default: "",
    },
  },
  icon: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // basic length check: emojis are 1–2 characters long
        return typeof v === "string" && v.length <= 2;
      },
      message: "Icon must be a valid emoji (1 to 2 characters max)",
    },
  },
}, { timestamps: true });

const StatModel = mongoose.model("Stat", statSchema);

module.exports = StatModel;