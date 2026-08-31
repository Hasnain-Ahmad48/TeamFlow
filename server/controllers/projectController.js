const mongoose = require("mongoose");
const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const {name, description, status} = req.body;

    //validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "project name is required",
      });
    }

    const lastProject = await Project.findOne()
      .sort({createdAt: -1})
      .select("projectId");

    let nextNumber = 1001;

    if (lastProject && lastProject.projectId) {
      const lastNumber = parseInt(lastProject.projectId.split("-")[1], 10);
      nextNumber = lastNumber + 1;
    }

    const projectId = `TF-${nextNumber}`;

    //create project
    const project = await Project.create({
      projectId,
      name,
      description,
      status,
      owner: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("create project Error", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: message[0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

const getUserProjects = async (req, res) => {
  try {
    console.log("Login user:", req.user._id);

    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("owner", "name email")
      .sort({createdAt: -1});

    console.log("Project found:", projects);

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "internal server error in getting user projects",
    });
  }
};


const getProjectById = async (req, res) => {
  try {
    const {projectId} = req.params;

    //find project by readible id
    const project = await Project.findOne({projectId})
      .populate("owner", "name email")
      .populate("members", "name email");

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //check if loggin user is project member
    const isMember = project.members.some(
      member => member._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this project",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project Error", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting project",
    });
  }
};

//update project
const updateProject = async (req, res) => {
  try {
    const {projectId} = req.params;
    const {name, description, status} = req.body;

    //find project
    const project = await Project.findOne({projectId});

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    //check if logg-in user is project owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can update the project",
      });
    }

    //update only provided field
    if (name !== undefined) {
      project.name = name;
    }
    if (description !== undefined) {
      project.description = description;
    }
    if (status !== undefined) {
      project.status = status;
    }

    //save updated project
    const updateProject = await project.save();

    return res.status(200).json({
      success: true,
      message: "Project update successfully",
      project: updateProject,
    });
  } catch (error) {
    console.error("update project error:", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map(err => err.message);

      return res.status(400).json({
        success: false,
        message: [0],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating project",
    });
  }
};

//deletproject
const deleteProject = async (req, res) => {
  try {
    const {projectId} = req.params;

    const project = await Project.findOne({projectId});

    //check if project exist
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not Found",
      });
    }

    //check if Loggin user is projext owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "only project owner can delete the project",
      });
    }

    //delete project
    await project.deleteOne();

    return res.status(200).json({
      success: false,
      message: "Project delete successfully",
    });
  } catch (error) {
    console.log("Delete project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting project",
    });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
