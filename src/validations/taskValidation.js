const Joi = require("joi");

const { TASK_MAX_XP_REWARD, TASK_MAX_STAT_POINT_REWARD } = require("../config/gameRules");

const statRewardSchema = Joi.object().keys({
  stat_id: Joi.string().hex().length(24).required(),
  value: Joi.number().integer().min(0).max(TASK_MAX_STAT_POINT_REWARD).required(),
});

const rewardSchema = Joi.object().keys({
  xp: Joi.number().integer().min(0).max(TASK_MAX_XP_REWARD).default(0),
  stats: Joi.array().items(statRewardSchema).default([]),
});

const baseTaskFields = {
  title: Joi.string().min(3).max(30),
  description: Joi.string().max(200).allow(""),
  linked_quest: Joi.string().hex().length(24).optional(),
  due_date: Joi.date().greater("now").optional(),
  rewards: rewardSchema,
};

const taskValidation = {
  create: Joi.object({
    ...baseTaskFields,
    title: baseTaskFields.title.required(), // Required in create only
    rewards: baseTaskFields.rewards.required(),
  }),

  update: Joi.object(baseTaskFields),
};

module.exports = taskValidation;