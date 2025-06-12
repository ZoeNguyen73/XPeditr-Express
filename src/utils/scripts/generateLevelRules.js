const fs = require("fs");
const path = require("path");

const { 
  LEVELING_BASE_XP, 
  LEVELING_GROWTH_EXPONENT, 
  MAX_LEVEL 
} = require("../../config/gameRules");

// Special requirements at specific levels

const specialRules = {
  5: {
    stats: { count: 2, min_level: 2 },
  },
  10: {
    stats: { count: 4, min_level: 2 },
  },
  20: {
    stats: { count: 3, min_level: 3 },
  },
  30: {
    stats: { count: 4, min_level: 3 },
  },
  40: {
    stats: { count: 3, min_level: 5 },
  },
  50: {
    stats: { count: 5, min_level: 5 },
  },
};

const levelUpRules = [];
let acc_xp_required = 0;

for (let level = 2; level <= MAX_LEVEL; level++) {
  const xp_required = Math.round(LEVELING_BASE_XP * Math.pow(level, LEVELING_GROWTH_EXPONENT));
  acc_xp_required += xp_required;

  const rule = {
    level,
    xp_required,
    acc_xp_required,
  };

  if (specialRules[level]) {
    rule.additional_requirements = specialRules[level];
  }

  levelUpRules.push(rule)

};

// Save to config/gameRules.js
const outputPath = path.join(__dirname, "../../config/levelUpRules.js");

const fileContent = "const levelUpRules = " +
  JSON.stringify(levelUpRules, null, 2) +
  ";\n\nmodule.exports = { levelUpRules };";

fs.writeFileSync(outputPath, fileContent);

console.log(">>> Level rules generated and saved to config/levelUpRules.js");
