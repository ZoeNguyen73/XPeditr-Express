require("dotenv").config();
const mongoose = require("mongoose");

const STATS = [
  { name: "Strength", 
    code: "STR", 
    icon: "💪",
    description: {
      short_description: "Power through physical tasks and feel unstoppable",
      example_life_habits: [
        "Go to the gym, Do morning yoga or stretches", 
        "Take the stairs instead of the elevator",
        "Do morning yoga or stretches"
      ],
      tooltip_text: "Power through challenges. Earn this when you hit the gym, go for a run, or push yourself physically!",
    },
  },
  { name: "Intelligence", 
    code: "INT", 
    icon: "🧠",
    description: {
      short_description: "Expand your brainpower and master new knowledge",
      example_life_habits: [
        "Read a book", 
        "Study a new topic",
        "Practice a language"
      ],
      tooltip_text: "Sharpen your mind. Earn this by reading, studying, or learning something new!",
    },
  },
  { name: "Wisdom", 
    code: "WIS", 
    icon: "😌",
    description: {
      short_description: "Reflect, grow, and make thoughtful choices",
      example_life_habits: [
        "Meditate", 
        "Journal your thoughts",
        "Plan your week"
      ],
      tooltip_text: "Think before you leap. Earn this when you slow down, reflect, or make mindful decisions.",
    },
  },
  { name: "Charisma", 
    code: "CHA", 
    icon: "💬",
    description: {
      short_description: "Shine in social situations and build connections",
      example_life_habits: [
        "Start a conversation with an old friend", 
        "Attend a social event",
        "Build a new connection"
      ],
      tooltip_text: "Farm aura and build confidence. Earn this when you connect, communicate, or put yourself out there!",
    },
  },
  { name: "Dexterity", 
    code: "DEX", 
    icon: "🔧",
    description: {
      short_description: "Hone precision and stay agile in body and mind",
      example_life_habits: [
        "Play an instrument", 
        "Draw or craft",
        "Make a tiktok video"
      ],
      tooltip_text: "Gain finesse and spring your ideas to life. Earn this by training your craft or building cool things!",
    },
  },
  { name: "Vitality", 
    code: "VIT", 
    icon: "🔮",
    description: {
      short_description: "Boost your overall energy and well-being",
      example_life_habits: [
        "Sleep 7+ hours", 
        "Eat a balanced meal",
        "Stay hydrated"
      ],
      tooltip_text: "Stay energized and radiant. Earn this when you rest, refuel, or take care of your health!",
    },
  },
];

const StatModel = require("../../models/statModel");

const connectDb = async () => {
  try {

    if (!process.env.MONGO_DB_STRING) {
      throw new Error("MONGO_DB_STRING is not defined in the environment variables.");
    }

    await mongoose.connect(process.env.MONGO_DB_STRING, { dbName: "XPeditr" });
    console.log("Connected to DB");
  } catch (error) {
    console.log(`Failed to connect to DB: ${error}`);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDb();

  console.log("===> Stats data seeding...");

  try {
    for await (const stat of STATS) {
      await StatModel.create(stat);
    }
    console.log(`===> Completed seeding ${STATS.length} stats.`);
  } catch (error) {
    console.error(error.message);
  } finally {
    process.exit(1);
  }
};

seed();