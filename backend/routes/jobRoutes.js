const express = require("express");
const router = express.Router();
const {
  getJobs, getJobById, createJob, updateJob, deleteJob, jobValidation,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", protect, getJobs);
router.get("/:id", protect, getJobById);

router.post("/", protect, requireRole("RECRUITER"), jobValidation, createJob);
router.put("/:id", protect, requireRole("RECRUITER", "ADMIN"), updateJob);
router.delete("/:id", protect, requireRole("RECRUITER", "ADMIN"), deleteJob);

module.exports = router;
