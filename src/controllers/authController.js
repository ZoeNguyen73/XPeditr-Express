const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const PendingUserModel = require("../models/pendingUserModel");
const UserModel = require("../models/userModel");
const StatModel = require("../models/statModel");
const UserValidator = require("../validations/userValidation");
const RefreshTokenModel = require("../models/refreshTokenModel");

const { badRequest, notFound, createError } = require("../utils/errorHelpers");

const createAccessToken = (userId) => {
  const accessToken = jwt.sign(
    {
      // accessToken expiring in 15 minutes
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
      data: { id: userId },
    },
    process.env.JWT_SECRET_ACCESS
  );

  return accessToken;
};

const createRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    {
      // refresh token expiring in 1 day
      exp: Math.floor(Date.now()/1000 + 60 * 60 * 24),
      data: { id: userId },
    },
    process.env.JWT_SECRET_REFRESH
  );
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000); // 1 day

  return {token: refreshToken, expiresAt };
};

const generateTempUsername = (email) => {
  const baseUsername = email.split('@')[0]; // "zoe"
  const randomSuffix = Math.random().toString(36).slice(2, 6); // "1x3a"
  const tempUsername = `${baseUsername}_${randomSuffix}`; // "zoe_1x3a"
  return tempUsername;
};

const initStatsForUser = async () => {
  const allStats = await StatModel.find().lean();
  const stats = [];
  allStats.forEach(stat => stats.push({ stat_id: stat._id, value: 0}));
  return stats;
};

const controller = {
  register: async (req, res, next) => {
    let validatedResults = null;

    try {
      validatedResults = await UserValidator.register.validateAsync(req.body);
      const { email, password } = validatedResults;

      const normalizedEmail = email.trim().toLowerCase();

      // check if there is an existing account with the same email
      const [emailExists, pendingEmailExists] = await Promise.all([
        UserModel.findOne({ email: normalizedEmail }),
        PendingUserModel.findOne({ email: normalizedEmail }),
      ]);

      if (emailExists) throw badRequest("An account with this email already exists");
      if (pendingEmailExists) throw badRequest("This email has been used for registration before. Please check your email inbox for activation link.");

      const passwordHash = await bcrypt.hash(password, 10);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      const token = crypto.randomBytes(32).toString("hex");

      // create a Pending User entry
      await PendingUserModel.create({ email: normalizedEmail, passwordHash, token, expiresAt });

      return res.status(200).json({ activateToken: token });

    } catch (error) {
      next(error);
    }
  },

  activate: async (req, res, next) => {
    try {
      const { token } = req.query;

      // confirm that a pending user entry exists:
      const pendingUser = await PendingUserModel.findOne({ token });
      
      if (!pendingUser) throw badRequest("Activation link has expired");

      // check if the token has already expired
      if (pendingUser.expiresAt < Date.now()) {
        await PendingUserModel.deleteOne({ token });
        throw badRequest("Activation link has expired");
      }

      const { email, passwordHash } = pendingUser;

      // check if an account has already existed - unlikely but just to be safe
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) throw badRequest("Account already activated");

      const username = generateTempUsername(email);
      const stats = await initStatsForUser();
      
      const user = await UserModel.create({
        username,
        email,
        password_hash: passwordHash,
        needs_profile_update: true,
        stats
      });

      await PendingUserModel.deleteOne({ token });

      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);

      // store refresh token in database
      await RefreshTokenModel.create(refreshToken);

      return res.status(201).json({
        message: "Account activated",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          needs_profile_update: user.needs_profile_update,
        },
        accessToken,
        refreshToken: refreshToken.token,
      });

    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    let validatedResults = null;

    try {
      validatedResults = await UserModel.login.validateAsync(req.body);
      const { username, password } = validatedResults;
      const user = await UserModel.findOne({ username });

      if (!user) throw notFound("Unable to find matching account");

      const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordCorrect) throw createError("Incorrect username or password");
      
      const accessToken = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);
      await RefreshTokenModel.create(refreshToken);

      return res.status(200).json({ avatar: user.avatar, accessToken, refreshToken: refreshToken.token });

    } catch (error) {
      next(error);
    }
  },

  refresh: async (req, res, next) => {

  },

  logout: async (req, res, next) => {

  },
};

module.exports = controller;