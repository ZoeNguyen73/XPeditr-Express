require("dotenv").config();
const mongoose = require("mongoose");

const QUOTES = require("./QUOTES.json");

const QuoteModel = require("../../models/quoteModel");

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

  console.log("===> Quotes data seeding...");

  try {
    for await (const quote of QUOTES) {
      await QuoteModel.create(quote);
    }
    console.log(`===> Completed seeding ${QUOTES.length} quotes.`);
  } catch (error) {
    console.error(error.message);
  } finally {
    process.exit(1);
  }
};

seed();