require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// create .env file and add PORT=3000
const port = process.env.PORT || 8800;

// in .env file add CORS_ORIGIN=*
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.listen(port, () => {
	console.log(`====>XXX app listening on port ${port}<====`);
});