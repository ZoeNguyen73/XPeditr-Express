const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const PendingUserModel = require("../models/pendingUserModel");
const UserModel = require("../models/userModel");
const UserValidator = require("../validations/userValidation");
const RefreshTokenModel = require("../models/refreshTokenModel");

const { badRequest } = require("../utils/errorHelpers");

const controller = {
  register: async (req, res, next) => {
    console.log("==> authController.register...");
    let validatedResults = null;

    try {
      validatedResults = await UserValidator.register.validateAsync(req.body);
      const { email, username, password } = validatedResults;

      const normalizedEmail = email.trim().toLowerCase();

      // check if there is an existing account with the same email and/or username
      const [emailExists, usernameExists] = await Promise.all([
        UserModel.findOne({ email: normalizedEmail }),
        UserModel.findOne({ username }),
      ]);

      if (emailExists) throw badRequest("An account with this email already exists");
      if (usernameExists) throw badRequest("An account with this username already exists");

      // check if there is a pending registration with the same email
      const pendingUser = await PendingUserModel.findOne({ email: normalizedEmail});
      if (pendingUser) throw badRequest("This email has been used for registration before. Please check your email inbox for activation link.");

      const passwordHash = await bcrypt.hash(password, 10);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      const token = crypto.randomBytes(32).toString("hex");

      // create a Pending User entry
      await PendingUserModel.create({ email: normalizedEmail, username, passwordHash, token, expiresAt });

      return res.status(200).json({ activateToken: token });

    } catch (error) {
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