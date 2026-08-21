const express = require("express");
const {registerUser} = require("../controllers/authController");

const router = express.Router();

//register user
router.post("/register", registerUser);

module.exports = router;
