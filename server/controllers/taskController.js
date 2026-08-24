const Task = require("../models/Task");
// const Project = require("../models/Project");

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
    const isMember = isProjectMember(
      task.project,
      req.user._id
    )

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

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
};
