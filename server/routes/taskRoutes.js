const express = require("express");
const router = express.Router();

const {createTask, getProjectTasks} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

//create task
router.post("/", protect, createTask);

//get all task of project
router.get("/project/:projectId", protect, getProjectTasks);

module.exports = router;
