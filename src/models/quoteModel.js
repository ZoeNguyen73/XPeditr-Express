const mongoose = require("mongoose");

const { QUOTE_CATEGORIES } = require("../config/constants");

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: [{
      type: String,
      enum: [...QUOTE_CATEGORIES],
    }],
    default: []
  }
})

const QuoteModel = mongoose.model("Quote", quoteSchema);

module.exports = QuoteModel;