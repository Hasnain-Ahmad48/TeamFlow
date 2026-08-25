const express = require("express");
const router = express.Router();

const {createTask, getProjectTasks,getTaskById,updateTask,deleteTask,updateTaskStatus} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

//create task
router.post("/", protect, createTask);

//get all task of project
router.get("/project/:projectId", protect, getProjectTasks);

//get single task by ID
router.get("/:taskId",protect,getTaskById)

//update task status
router.patch("/:taskId/status",protect,updateTaskStatus)


//update task
router.patch("/:taskId",protect,updateTask)

//delete task
router.delete("/:taskId",protect,deleteTask)


module.exports = router;
