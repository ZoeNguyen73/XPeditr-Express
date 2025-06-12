const Joi = require("joi");

const { FREQUENCY_TYPES, HABIT_TYPES } = require("../config/constants");
const { HABIT_MAX_XP_REWARD, HABIT_MAX_STAT_POINT_REWARD } = require("../config/gameRules");

const statRewardSchema = Joi.object().keys({
  stat_id: Joi.string().hex().length(24).required(),
  value: Joi.number().integer().min(0).max(HABIT_MAX_STAT_POINT_REWARD).required(),
});

const rewardSchema = Joi.object().keys({
  xp: Joi.number().integer().min(0).max(HABIT_MAX_XP_REWARD).default(0),
  stats: Joi.array().items(statRewardSchema).default([]),
});

const progressLogSchema = Joi.array().items(
  Joi.object().keys({
    date: Joi.date().less("now").required(),
    value: Joi.number().integer().min(1).default(1).required(),
  })
).default([]);

const baseHabitFields = {
  title: Joi.string().min(3).max(30),
  description: Joi.string().max(200).allow(""),
  frequency: Joi.string().valid(...FREQUENCY_TYPES).default(FREQUENCY_TYPES[0]),
  type: Joi.string().valid(...HABIT_TYPES).default(HABIT_TYPES[0]),
  target_value: Joi.number().integer().min(1).default(1),
  progress_log: progressLogSchema,
  current_streak: Joi.number().integer().min(0).default(0),
  last_reset: Joi.date().less("now").default(null),
  last_completed: Joi.date().less("now").default(null),
  linked_quest: Joi.string().hex().length(24).allow(null).default(null),
  reward_per_completion: rewardSchema,
  is_active: Joi.boolean().default(true),
};

const habitValidation = {
  create: Joi.object({
    ...baseHabitFields,
    title: baseHabitFields.title.required(),
    frequency: baseHabitFields.frequency.required(),
    type: baseHabitFields.type.required(),
    target_value: baseHabitFields.target_value.required(),
    reward_per_completion: baseHabitFields.reward_per_completion.required()
  }),

  update: Joi.object(baseHabitFields),
};

module.exports = habitValidation;