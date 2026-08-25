const Task = require("../models/Task");
const Project = require("../models/Project");

const {
  getProjectByProjectId,
  isProjectMember,
} = require("../utils/projectAccess");

//create task
const createTask = async (req, res) => {
  try {
    const {title, description, projectId, assignedTo, priority, dueDate} =
      req.body;

    //validate required field
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task Title is required",
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "Due date is  required",
      });
    }

    //find project using rproject id
    // const project = await Project.findOne({projectId});

    // //check if project exist
    // if (!project) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Project not found",
    //   });
    // }

    // //check if loggin user is project member
    // const isMember = project.members.some(
    //   member => member.toString() === req.user._id.toString(),
    // );

    // if (!isMember) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorizedd to create task in this project",
    //   });
    // }

    //code after  utils
    const project = await getProjectByProjectId(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember = isProjectMember(project, req.user._id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not authorize to access taks in this project",
      });
    }

    //if assignedTo is provided check if user is project member
    if (assignedTo) {
      const isAssignedUserMember = project.members.some(
        member => member.toString() === assignedTo,
      );

      if (!isAssignedUserMember) {
        return res.status(400).json({
          success: false,
          message: "Assigned user is not member of this project",
        });
      }
    }

    //find last task to generate nest task id
    // const lastTask = await Task.findOne()
    //   .sort({createdAt: -1})
    //   .select("taskId");

    // let nextNumber = 1001;

    // if (lastTask && lastTask.taskId) {
    //   const lastNumber = parseInt(lastTask.taskId.split("-")[1], 10);
    //   nextNumber = lastNumber + 1;
    // }

    // const taskId = `TASK-${nextNumber}`;

    // Get the highest task number
    const lastTask = await Task.aggregate([
      {
        $match: {
          taskId: {$regex: "^TASK-[0-9]+$"},
        },
      },
      {
        $addFields: {
          taskNumber: {
            $toInt: {
              $arrayElemAt: [{$split: ["$taskId", "-"]}, 1],
            },
          },
        },
      },
      {
        $sort: {
          taskNumber: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    let nextNumber = 1001;

    if (lastTask.length > 0) {
      nextNumber = lastTask[0].taskNumber + 1;
    }

    const taskId = `TASK-${nextNumber}`;

    //create task
    const task = await Task.create({
      taskId,
      title,
      description,
      project: project._id,
      assignedTo: assignedTo || null,
      assignedBy: req.user._id,
      priority,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Created task error:", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map(err => err.message);

      return res.status(400).json({
        success: false,
        message: message[0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while creating task",
    });
  }
};

//get all task of project
const getProjectTasks = async (req, res) => {
  try {
    const {projectId} = req.params;

    //find project by ID
    const project = await getProjectByProjectId(projectId);

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //check if loggin user is project member
    const isMember = isProjectMember(project, req.user._id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "you are not authorized to access tasks of this project",
      });
    }

    //get all task belong to project
    const tasks = await Task.find({
      project: project._id,
    })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email")
      .sort({createdAt: -1});

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get project task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting project tasks",
    });
  }
};

//get task by id
const getTaskById = async (req, res) => {
  try {
    const {taskId} = req.params;

    //find task by ID
    const task = await Task.findOne({taskId})
      .populate("project", "projectId name description status members")
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    //check if task exist
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //check if loggin user is project member
    const isMember = isProjectMember(task.project, req.user._id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "you are not authorized to access this tasks ",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting tasks",
    });
  }
};

//update task
const updateTask = async (req, res) => {
  try {
    const {taskId} = req.params;

    const {title, description, priority, dueDate, assignedTo} = req.body;

    //find task
    const task = await Task.findOne({taskId});

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //find project related to task
    const project = await Project.findById(task.project);

    //check if project exist
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //cjheck if login user is project owner
    const isOwner = project.owner.toString() === req.user._id.toString();

    //check if loggin user creatd the task
    const isTaskCreater =
      task.assignedBy.toString() === req.user._id.toString();

    //only project owner and task creater can update task
    if (!isOwner && !isTaskCreater) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task",
      });
    }

    //if assignedTo is provided check project membership
    if (assignedTo !== undefined && assignedTo !== null) {
      const isAssignedUserMember = isProjectMember(project, assignedTo);

      if (!isAssignedUserMember) {
        return res.status(400).json({
          success: false,
          message: "Assigned user is not member of this project",
        });
      }
      task.assignedTo = assignedTo;
    }

    //allow task to be unassinged
    if (assignedTo === null) {
      task.assignedTo = null;
    }

    //update only provided field
    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    //save task
    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated  successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: message[0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating task",
    });
  }
};

//delete task
const deleteTask = async (req, res) => {
  try {
    const {taskId} = req.params;

    //find task
    const task = await Task.findOne({taskId});

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //finf project related to task
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        success: fasle,
        message: "Project not found",
      });
    }

    //check if login user is project member
    const isOwner = project.owner.toString() === req.user._id.toString();

    //ceck if login user created task
    const isTaskCreator =
      task.assignedBy.toString() === req.user._id.toString();

    //only project owner and task creator can delete the task
    if (!isOwner && !isTaskCreator) {
      return res.status(403).json({
        success: false,
        message: "You are not authorizez to delete this task",
      });
    }

    //delete task
    await Task.findByIdAndDelete(task._id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting the task",
    });
  }
};

//update task staus
const updateTaskStatus = async (req, res) => {
  try {
    const {taskId} = req.params;
    const {status} = req.body;

    //check if status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "TAsk status is required",
      });
    }

    //find task
    const task = await Task.findOne({taskId});

    //check if task exist
    if (!task) {
      return res.status(404).json({
        success: false,
        success: "Task not found",
      });
    }

    //find project related to task
    const project = await Project.findById(task.project);

    //check if project exist
    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Project not found",
      });
    }

    //check if loggin user is project owner
    const isOwner = project.owner.toString() === req.user._id.toString();

    //check if loggin user craeted the task
    const isTaskCreator =
      task.assignedBy.toString() === req.user._id.toString();

    //check if loggin user is assigned to this task
    const isAssignedUser =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isOwner && !isTaskCreator && !isAssignedUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authrized to update this task status",
      });
    }

    //update task
    task.status = status;

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task status error:", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: message[0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating task status",
    });
  }
};

module.exports = {
  isProjectMember,
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus
};
