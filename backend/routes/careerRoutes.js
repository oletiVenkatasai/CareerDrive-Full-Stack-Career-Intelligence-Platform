const express = require("express");
const router = express.Router();
const {
  getProfile,
  getSkillGaps,
  getRecommendedJobs,
  simulateSkillImpact,
  getRoadmap,
  getOpportunityImpactData,
  getSkillGraph,
  getSkillDeps,
} = require("../controllers/careerController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.use(protect, requireRole("STUDENT"));

router.get("/profile", getProfile);
router.get("/skill-gaps", getSkillGaps);
router.get("/recommended-jobs", getRecommendedJobs);
router.post("/simulate", simulateSkillImpact);
router.get("/roadmap", getRoadmap);
router.get("/opportunity-impact", getOpportunityImpactData);
router.get("/skill-graph", getSkillGraph);
router.get("/skill-dependencies/:skillName", getSkillDeps);

module.exports = router;
