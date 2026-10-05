const {
  getCareerProfile,
  simulateSkills,
  getCareerRoadmap,
  getOpportunityImpact,
} = require("../services/careerIntelligenceService");
const { getJobRecommendations } = require("../services/recommendationService");
const { getSkillDependencies, getDependencyGraph } = require("../services/skillGraphService");

const getProfile = async (req, res, next) => {
  try {
    const profile = await getCareerProfile(req.user);
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

const getSkillGaps = async (req, res, next) => {
  try {
    const profile = await getCareerProfile(req.user);
    res.json({ success: true, data: profile.skillGaps });
  } catch (error) {
    next(error);
  }
};

const getRecommendedJobs = async (req, res, next) => {
  try {
    const recommendations = await getJobRecommendations(req.user, { limit: 10 });
    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

const simulateSkillImpact = async (req, res, next) => {
  try {
    const { additionalSkills = [], targetRole } = req.body;

    if (!Array.isArray(additionalSkills)) {
      return res.status(400).json({ success: false, message: "additionalSkills must be an array" });
    }

    const result = await simulateSkills(
      req.user.skills || [],
      additionalSkills,
      targetRole || req.user.targetRole || ""
    );

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await getCareerRoadmap(req.user);
    res.json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
};

const getOpportunityImpactData = async (req, res, next) => {
  try {
    const impact = await getOpportunityImpact();
    res.json({ success: true, data: impact });
  } catch (error) {
    next(error);
  }
};

const getSkillGraph = async (req, res, next) => {
  try {
    const graph = await getDependencyGraph();
    res.json({ success: true, data: graph });
  } catch (error) {
    next(error);
  }
};

const getSkillDeps = async (req, res, next) => {
  try {
    const deps = await getSkillDependencies(req.params.skillName);
    res.json({ success: true, data: deps });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getSkillGaps,
  getRecommendedJobs,
  simulateSkillImpact,
  getRoadmap,
  getOpportunityImpactData,
  getSkillGraph,
  getSkillDeps,
};
