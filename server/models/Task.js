const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Description can not exceed 2000 characters"],
    },

    //project this task belong to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    //user  assign to complete this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null,
    },

    //user who created/assigned the task
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },

    //task priority
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    //deadline
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timeStamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
