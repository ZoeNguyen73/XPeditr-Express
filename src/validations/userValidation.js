const Joi = require("joi");

const { AVATAR_OPTIONS } = require("../config/constants");
const { MAX_LEVEL } = require("../config/gameRules");

const statSchema = Joi.object().keys({
  stat_id: Joi.string().hex().length(24).required(),
  value: Joi.number().integer().min(0).required(),
});

const companionsSchema = Joi.array().items(Joi.string().hex().length(24));

const baseUserFields = {
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  avatar: Joi.string().valid(...AVATAR_OPTIONS),
  level: Joi.number().integer().min(1).max(MAX_LEVEL),
  xp: Joi.number().integer().min(0),
  coins: Joi.number().integer().min(0),
  stats: Joi.array().items(statSchema),
  companions: companionsSchema,
};

const userValidation = {
  register: Joi.object({
    email: baseUserFields.email.required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref("password")).required()
      .messages({ "any.only": "Confirm password must match password" }),
  }),

  login: Joi.object({
    username: baseUserFields.username.required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
  }),

  update: Joi.object({
    ...baseUserFields, // All fields optional by default here
  }),
};

module.exports = userValidation;