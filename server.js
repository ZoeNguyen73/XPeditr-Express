require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const authRouter = require("./src/routes/authRoutes");
const userRouter = require("./src/routes/userRoutes");

const notFoundHandler = require("./src/middlewares/notFoundHandler");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 8800;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: process.env.CORS_ORIGIN }));

// all routes
app.use("/api/v1/auth", authRouter);
app.use("/api,/v1/users", userRouter);

// Handle 404 errors
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

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