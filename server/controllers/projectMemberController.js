const Project = require("../models/Project");
const User = require("../models/User");

//add project member
const addProjectMember = async (req, res) => {
  try {
    const {projectId} = req.params;
    const {email} = req.body;

    //validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Member email is required",
      });
    }
    //finf project
    const project = await Project.findOne({projectId});

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //check if login user is project member
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can add members",
      });
    }

    //finf user by email
    const user = await User.findOne({email});

    //check if user exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //check if user is already project member
    const isMember = project.members.some(
      member => member.toString() === user._id.toString(),
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a project member",
      });
    }

    //add user to project member
    project.members.push(user._id);

    //save project
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      member: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Added project member error:", error.message);

    return res.status(500).json({
      success: false,
      messsage: "internal server Error while adding project member",
    });
  }
};

//get project member
const getProjectMembers = async (req, res) => {
  try {
    const {projectId} = req.params;

    //find project and populate memmber
    const project = await Project.findOne({projectId}).populate(
      "members",
      "name email",
    );

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //check if loggin user is member
    const isMember = project.members.some(
      member => member._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access project mmebers",
      });
    }

    //isOwner check and return in every member
    const members = project.members.map(member => ({
      _id: member._id,
      name: member.name,
      email: member.email,
      isOwner: member._id.toString() === project.owner.toString(),
    }));

    return res.status(200).json({
      success: true,
      count: project.members.length,
      members,
    });
  } catch (error) {
    console.error("Get project member error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting project members",
    });
  }
};

//remove project member
const removeProjectMember = async (req, res) => {
  try {
    const {projectId, userId} = req.params;

    //find project
    const project = await Project.findOne({projectId});

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //chenck if logg in user is project member
    if (project.owner.toString() !== req.user._id.toString()) {
      return (
        res.status(403) /
        json({
          success: false,
          message: "ONly project owner can remove members",
        })
      );
    }

    //check if project owner is trying to remove themselve
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Project owner can not be remove",
      });
    }

    //check if user is project mmeber
    const isMember = project.members.some(
      member => member.toString() === userId,
    );

    if (!isMember) {
      return res.status(404).json({
        success: false,
        message: "User is not member of the project",
      });
    }

    //remove member from project
    project.members = project.members.filter(
      member => member.toString() !== userId,
    );

    //save udpate project
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project member removed successfully",
      removedUserId: userId,
    });
  } catch (error) {
    console.error("Removed member from project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while removing project member",
    });
  }
};

module.exports = {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
};
