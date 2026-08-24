const Project = require("../models/Project");

// Find project using readable project ID
const getProjectByProjectId = async projectId => {
  const project = await Project.findOne({projectId});

  return project;
};

// Check if user is a member of the project
const isProjectMember = (project, userId) => {
  return project.members.some(
    member => member.toString() === userId.toString(),
  );
};

module.exports = {
  getProjectByProjectId,
  isProjectMember,
};