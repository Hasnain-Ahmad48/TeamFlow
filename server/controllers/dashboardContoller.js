const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStatistics = async (req, res) => {
  try {
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

    //count total accesible projects
    const totalProjects = projects.length;

    return res.status(200).json({
      success: true,
      statistics: {
        totalProjects,
        totalTasks,
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
