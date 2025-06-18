const expresss = require("express");

const userController = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

const router = expresss.Router();

router.get("/:username", userController.retrieveByUsername);

router.put("/:username", 
  userAuth.isAuthenticated,
  userAuth.isAuthorized("Admin"),
  userController.updateByUsername
);

module.exports = router;