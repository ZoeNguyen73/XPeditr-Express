const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/activate", authController.activate);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.delete("/logout", authController.logout);

module.exports = router;