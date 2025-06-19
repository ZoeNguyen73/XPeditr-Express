const UserModel = require("../models/userModel");
const UserValidator = require("../validations/userValidation");

const controller = {
  retrieveByUsername: async (req, res, next) => {

  },

  updateByUsername: async (req, res, next) => {
    let validatedResults = null;

    try {
      validatedResults = await UserValidator.update.validateAsync(req.body);
      if (validatedResults.email) validatedResults.email = validatedResults.email.trim().toLowerCase();
      validatedResults.needs_profile_update = false;

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.authUserId,
        validatedResults,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Account updated",
        user : {
          id: updatedUser._id,
          username: updatedUser.username,
          updated_fields: validatedResults,
        }
      });
      
    } catch (error) {
      next(error);
    }
  },
};

module.exports = controller;