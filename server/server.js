require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes=require("./routes/authRoutes")
const projectRoutes=require("./routes/projectRoutes")



const app = express();

connectDB();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/projects",projectRoutes)

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
