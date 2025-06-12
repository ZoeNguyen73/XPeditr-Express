const Joi = require("joi");

const userCompanionSchema = {
  create: Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
  }),
  update: Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
  }),
};

module.exports = userCompanionSchema;