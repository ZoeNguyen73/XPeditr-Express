const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");

const { unauthorized, notFound } = require("../utils/errorHelpers");

const userAuth = {
  isOptionalAuthenticated: async (req, res, next) => {
    if (!req.header("Authorization")) {
      req.authUser = "guest";
      return next();
    } else {
      return userAuth.isAuthenticated(req, res, next);
    }
  },

  isAuthenticated: async (req, res, next) => {
    try {

      const authHeader = req.header("Authorization");

      if (!authHeader) throw unauthorized("Authentication details emmpty");

      if (authHeader.slice(0,7) !== "Bearer ") throw unauthorized("Invalid Authentication type");

      const token = authHeader.slice(7);
      if (token.length === 0) throw unauthorized("Invalid Authentication token");

      const verified = jwt.verified(token, process.env.JWT_SECRET_ACCESS);
      if (!verified) throw unauthorized("Invalid Authentication token");

      const user = await UserModel.findById(verified.data.id);
      if (!user) throw notFound("Unable to find matching user account");

      req.authUserId = verified.data.id;
      return next();

    } catch (error) {
      next(error);
    }
  },

  isAuthorized: async (req, res, next) => {

  },
};

module.exports = userAuth;