const expresss = require("express");

const userController = require("../controllers/userController");

const router = expresss.Router();

router.get("/:username", userController.retrieveByUsername);
router.put("/:username", userController.updateByUsername);

module.exports = router;