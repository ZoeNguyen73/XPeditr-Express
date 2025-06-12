const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserModel = require("../models/userModel")
const UserValidator = require("../validations/userValidation");
const RefreshTokenModel = require("../models/refreshTokenModel");

const { badRequest } = require("../utils/errorHelpers");

const controller = {
  register: async (req, res, next) => {
    let validatedResults = null;
    let user = null;

    try {
      validatedResults = await UserValidator.register.validateAsync(req.body);
      const { email, username, password } = validatedResults;

      // check if there is an existing account with the same email and/or username
      const [emailExists, usernameExists] = await Promise.all([
        UserModel.findOne({ email }),
        UserModel.findOne({ username }),
      ]);

      if (emailExists) throw badRequest("An account with this email already exists");
      if (usernameExists) throw badRequest("An account with this username already exists");

      const hash = await bcrypt.hash(password, 10);

      // generate activation token
      const activateToken = jwt.sign(
        {
          // activateToken expiring in 15 minutes
          exp: Math.floor(Date.now() / 1000) + 60 * 15,
          data: { email, username, hash },
        },
        process.env.JWT_SECRET_ACTIVATE
      );

      return res.status(200).json({ activateToken });

    } catch (error) {

      if (error.isJoi) {
        error.statusCode = 400;
        error.details = error.details?.[0]?.message || "Invalid input";
      } else if (!error.statusCode) {
        error.statusCode = 500;
        error.details = "An unexpected error occurred";
      }

      next(error);
    }
  },

  login: async (req, res, next) => {

  },

  refresh: async (req, res, next) => {

  },

  logout: async (req, res, next) => {

  },
};

module.exports = controller;