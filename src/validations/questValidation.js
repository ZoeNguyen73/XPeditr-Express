const Joi = require("joi");
const dayjs = require("dayjs");

const { QUEST_TYPES } = require("../config/constants");

// Custom date validator: allow due_date to be today or later (ignoring time)
const dueDateValidator = Joi.date()
  .optional()
  .custom((value, helpers) => {
    const today = dayjs().startOf("day");
    const dueDate = dayjs(value).startOf("day");

    if (dueDate.isBefore(today)) {
      return helpers.error("any.invalid", { message: "Due date must be today or in the future." });
    }

    return value;
  }, "Due date must not be in the past");

const baseQuestFields = {
  type: Joi.string().valid(...QUEST_TYPES),
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500).allow(""),
  parent_quest: Joi.string().hex().length(24).optional(),
  due_date: dueDateValidator,
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