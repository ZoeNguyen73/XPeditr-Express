const express = require("express");

const questController = require("../controllers/questController");
const userAuth = require("../middlewares/userAuth");

const router = express.Router();

router.post("/", userAuth.isAuthenticated, questController.createQuest);

module.exports = router;