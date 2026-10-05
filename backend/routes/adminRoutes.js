const express = require("express");
const router = express.Router();
const {
  getDashboard, getUsers, toggleUserStatus, getAllJobs,
  getAllApplications, getSkills, createSkill, createSkillDependency,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const Skill = require("../models/Skill");
const SkillDependency = require("../models/SkillDependency");

router.use(protect, requireRole("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.put("/users/:id/toggle", toggleUserStatus);
router.get("/jobs", getAllJobs);
router.get("/applications", getAllApplications);
router.get("/skills", getSkills);
router.post("/skills", createSkill);
router.post("/skill-dependencies", createSkillDependency);

router.get("/skill-dependencies", async (req, res, next) => {
  try {
    const deps = await SkillDependency.find().sort({ skill: 1 });
    res.json({ success: true, data: deps });
  } catch (err) { next(err); }
});

router.delete("/skill-dependencies/:id", async (req, res, next) => {
  try {
    await SkillDependency.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Dependency deleted" });
  } catch (err) { next(err); }
});

router.delete("/skills/:id", async (req, res, next) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Skill deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
