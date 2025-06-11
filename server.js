require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

// create .env file and add PORT=3000
const port = process.env.PORT || 8800;

// in .env file add CORS_ORIGIN=*
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.listen(port, async() => {
  try {
    await mongoose.connect(process.env.MONGO_DB_STRING, { dbName: "XPeditr" });
  } catch (error) {
    console.log(`====>Failed to connect to DB<==== Error: ${error}`);
    process.exit(1);
  }
  console.log(`====>Connected to MongoDB`);
  console.log(`====>XPeditr app listening on port ${port}<====`);
})