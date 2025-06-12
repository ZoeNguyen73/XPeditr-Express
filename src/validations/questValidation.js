const Joi = require("joi");

const { QUEST_TYPES } = require("../config/constants");

const baseQuestFields = {
  type: Joi.string().valid(...QUEST_TYPES),
  title: Joi.string().min(3).max(30),
  description: Joi.string().max(200).allow(""),
  parent_quest: Joi.string().hex().length(24).optional(),
  due_date: Joi.date().greater("now").optional(),
};

const questValidation = {
  create: Joi.object({
    ...baseQuestFields,
    title: baseQuestFields.title.required(),
    type: baseQuestFields.type.required(),
  }),
  update: Joi.object(baseQuestFields),
};

module.exports = questValidation;