module.exports = {
  
  STAT_CAP_PER_HABIT: 10,
  STAT_POINT_THRESHOLD_LEVEL: {
    1: 200, // accumulate 200 stat points to level up to 2
    2: 300,
    3: 400,
    4: 600,
    5: 800,
    6: 1000,
    7: 1300,
    8: 1600,
    9: 2000,
  },

  // XP level scaling formula:
  // XP to reach level N = baseXP * N*power
  LEVELING_BASE_XP: 100,
  LEVELING_GROWTH_EXPONENT: 1.5,
  MAX_LEVEL: 50,

  // specific level requirements can be edited in generateLevelRules.js script

  // XP rewards
  TASK_MAX_XP_REWARD: 15,
  TASK_MAX_STAT_POINT_REWARD: 10,
  HABIT_MAX_XP_REWARD: 10,
  HABIT_MAX_STAT_POINT_REWARD: 5,
  XP_BONUS_RATE_MINOR_QUEST: 0.3,

};