require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB();

//middleware
app.use(cors());
app.use(express.json());

//test routes
app.get("/", (req, res) => {
  res.json({
    message: "TeamFlow API is  running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
