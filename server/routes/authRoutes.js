const express = require("express");
const {registerUser,loginUser} = require("../controllers/authController");

const router = express.Router();

//register user
router.post("/register", registerUser);

//login routes
router.post("/login",loginUser)

module.exports = router;
