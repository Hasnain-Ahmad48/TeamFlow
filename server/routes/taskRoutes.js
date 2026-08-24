const express = require("express");
const router = express.Router();

const {createTask, getProjectTasks,getTaskById} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

//create task
router.post("/", protect, createTask);

//get all task of project
router.get("/project/:projectId", protect, getProjectTasks);

//get single task by ID
router.get("/:taskId",protect,getTaskById)

module.exports = router;
