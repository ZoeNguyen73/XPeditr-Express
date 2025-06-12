const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel")
const UserValidator = require("../validations/userValidation");
const RefreshTokenModel = require("../models/refreshTokenModel");

const controller = {
  register: async (req, res, next) => {

  },

  login: async (req, res, next) => {

  },

  refresh: async (req, res, next) => {

  },

  logout: async (req, res, next) => {

  },
};

module.exports = controller;