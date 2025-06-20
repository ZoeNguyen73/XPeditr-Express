const expresss = require("express");

const quoteController = require("../controllers/quoteController");
const userAuth = require("../middlewares/userAuth");

const router = expresss.Router();

router.get("/random", 
  userAuth.isAuthenticated,
  quoteController.getRandomQuote
);

module.exports = router;