const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {getDashboardStatistics} = require("../controllers/dashboardContoller");

router.get(
  "/",
   protect, 
  getDashboardStatistics,
);

module.exports = router;
