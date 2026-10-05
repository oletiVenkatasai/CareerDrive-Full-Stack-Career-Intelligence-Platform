const express = require("express");
const router = express.Router();
const {
  applyForJob, getMyApplications, getJobApplications, updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.post("/", protect, requireRole("STUDENT"), applyForJob);

router.get("/my", protect, requireRole("STUDENT"), getMyApplications);

router.get("/job/:jobId", protect, requireRole("RECRUITER", "ADMIN"), getJobApplications);

router.put("/:id/status", protect, requireRole("RECRUITER", "ADMIN"), updateApplicationStatus);

module.exports = router;
