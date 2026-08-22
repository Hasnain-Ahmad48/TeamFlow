const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
     projectId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
