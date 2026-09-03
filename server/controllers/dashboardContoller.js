const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStatistics = async (req, res) => {
  try {
    //count projects accessible to loggin user
    const totalProjects = await Project.countDocuments({
      members: req.user._id,
    });
    //find all project accessible to loggin user
    const projects = await Project.find({
      members: req.user._id,
    }).select("_id");

    //get only project IDs
    const projectIds = projects.map(project => project._id);

    //count all task belonging to user accessible projects
    const totalTasks = await Task.countDocuments({
      project: {$in: projectIds},
    });

    //count todo task inside accessible projects
    const todoTasks = await Task.countDocuments({
      project: {$in: projectIds},
      status: "todo",
    });

    //count in-progress tasks
    const inProgressTasks = await Task.countDocuments({
      project: {$in: projectIds},
      status: "in-progress",
    });

    //cuount  completed tasks
    const completedTasks = await Task.countDocuments({
      project: {$in: projectIds},
      status: "completed",
    });

    const myAssignedTasks = await Task.countDocuments({
      assignedTo: req.user._id,
    });

    return res.status(200).json({
      success: true,
      statistics: {
        totalProjects,
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        myAssignedTasks
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStatistics,
};
