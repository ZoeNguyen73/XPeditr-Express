const Joi = require('joi');

const { AVATAR_OPTIONS } = require("../config/constants");
const { MAX_LEVEL } = require("../config/gameRules");

const userValidation = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref("password")).required()
      .messages({ "any.only": "Confirm password must match password" }),
  }),
  login: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
  }),
  edit: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .optional(),
    avatar: Joi.string().valid(...AVATAR_OPTIONS).optional(),
    level: Joi.number().integer().min(1).max(MAX_LEVEL).optional(),
    xp: Joi.number().integer().min(0).optional(),
    coins: Joi.number().integer().min(0).optional(),
    stats: Joi.array().items(
      Joi.object({
        stat_id: Joi.string().hex().length(24).required(),
        value: Joi.number().integer().min(0).required(),
      })
    ).optional(),
    companions: Joi.array().items(Joi.string().hex().length(24)).optional(),
  }),
};

module.exports = userValidation;