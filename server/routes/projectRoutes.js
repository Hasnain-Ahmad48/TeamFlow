const express = require("express");

const {createProject, getUserProjects,getProjectById} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//create project
router.post("/", protect, createProject);
router.get("/",protect, getUserProjects);
router.get("/:projectId",protect,getProjectById)
module.exports = router;
