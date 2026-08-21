const express = require("express");

const {createProject,getUserProjests, getUserProjects} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//create project
router.post("/", protect, createProject);
router.get("/",protect, getUserProjects)
module.exports = router;
