const express = require("express");
const {registerUser,loginUser,getCurrentUser} = require("../controllers/authController");
const protect=require("../middleware/authMiddleware")

const router = express.Router();

//register user
router.post("/register", registerUser);

//login routes
router.post("/login",loginUser)

//get current user
router.get("/me", protect, getCurrentUser);

module.exports = router;
