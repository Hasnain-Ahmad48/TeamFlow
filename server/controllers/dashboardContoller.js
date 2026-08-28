const Project = require("../models/Project");

const getDashboardStatistics = async (req, res) => {
  try {
    //count proeject where loggin user is member
    const totalProjects = await Project.countDocuments({
      members: req.user._id,
    });

    return res.status(200).json({
      success: true,
      statistics: {
        totalProjects,
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

module.exports={
    getDashboardStatistics
}
