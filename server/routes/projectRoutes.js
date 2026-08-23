const express = require("express");

const {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} = require("../controllers/projectMemberController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

//create project
router.post("/", protect, createProject);
router.get("/", protect, getUserProjects);
router.get("/:projectId", protect, getProjectById);
router.patch("/:projectId", protect, updateProject);
router.delete("/:projectId", protect, deleteProject);

//member routes
router.post("/:projectId/members", protect, addProjectMember);
router.get("/:projectId/members", protect, getProjectMembers);
router.delete("/:projectId/members/:userId", protect, removeProjectMember);
module.exports = router;
