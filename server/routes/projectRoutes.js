const express = require("express");

const {createProject, getUserProjects,getProjectById,updateProject,deleteProject} = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//create project
router.post("/", protect, createProject);
router.get("/",protect, getUserProjects);
router.get("/:projectId",protect,getProjectById)
router.patch("/:projectId",protect,updateProject)
router.delete("/:projectId",protect,deleteProject)
module.exports = router;
