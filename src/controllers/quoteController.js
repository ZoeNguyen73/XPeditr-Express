const QuoteModel = require("../models/quoteModel");

const controller = {
  getRandomQuote: async (req, res, next) => {
    try {
      const { category } = req.query;

      let matchStage = {};

      if (category) {
        // Support comma-separated values and normalize to lowercase
        const categories = category.split(",").map((c) => c.trim().toLowerCase());

        matchStage = {
          $match: {
            category: { $elemMatch : { $in: categories }} // quote.category must match at least one
          }
        };
      } else {
        matchStage = { $match: {} }; // no category filter
      }
      
      const result = await QuoteModel.aggregate([
        matchStage,
        { $sample: { size: 1 } } // randomly pick one
      ]);

      if (result.length === 0) {
        return res.status(404).json({ message: "No quote found." });
      }

      res.status(200).json(result[0]);
      
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controller;