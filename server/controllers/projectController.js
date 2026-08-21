const mongoose=require("mongoose")
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

    //create project
    const project = await Project.create({
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

console.log("Login user:",req.user._id)

    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("owner", "name email")
      .sort({createdAt: -1});

      console.log("Project found:", projects)

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

//get single project by id
const getProjectById=async(req,res)=>{
    try{
        const {id}=req.params

        //validate mongoDB object
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid Project ID"
            })
        }

        //find project
        const project=await Project.findById(id)
        .populate("owner","name email")
        .populate("members", "name email")

        //check if project exist
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not Found"
            })
        }
        //check if logged in user is project member
        const isMember=project.members.some(
            (member)=>member._id.toString()===req.user._id.toString()
        )

        if(!isMember){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to access this project"
            })
        }

        return res.status(200).json({
            success:true,
            project
        })
    } catch(error){
        console.error("get Project Error:",error.message)

        return res.status(500).json({
            success:false,
            message:"Internal server while getting project"
        })
    }
}

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
};
