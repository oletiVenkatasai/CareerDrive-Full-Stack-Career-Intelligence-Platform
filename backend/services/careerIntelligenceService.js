const Job = require("../models/Job");
const { compareStudentWithJob, getRecommendedJobs, getSkillGaps } = require("./matchingService");
const { getAllPrerequisites } = require("./skillGraphService");
const { normalizeSkills } = require("../utils/normalizeSkill");

const getCareerProfile = async (student) => {
  const activeJobs = await Job.find({ status: "ACTIVE" });

  
  const jobMatches = getRecommendedJobs(student.skills, activeJobs);

  
  const topMatches = jobMatches.slice(0, 5).map(({ job, matchPercentage, matchedRequired, missingRequired, matchedPreferred }) => ({
    jobId: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    employmentType: job.employmentType,
    matchPercentage,
    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    matchedPreferred,
    deadline: job.deadline,
  }));

  
  const avgMatch =
    jobMatches.length > 0
      ? Math.round(jobMatches.reduce((sum, j) => sum + j.matchPercentage, 0) / jobMatches.length)
      : 0;

  
  const allMissingSkills = {};
  for (const { missingRequired } of jobMatches) {
    for (const skill of missingRequired) {
      allMissingSkills[skill] = (allMissingSkills[skill] || 0) + 1;
    }
  }

  
  const prioritizedGaps = Object.entries(allMissingSkills)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, jobsRequiring: count }));

  return {
    studentName: student.name,
    targetRole: student.targetRole || "Not Set",
    currentSkills: student.skills || [],
    profileCompletion: student.profileCompletion || 0,
    totalActiveJobs: activeJobs.length,
    averageMatchPercentage: avgMatch,
    topMatchingJobs: topMatches,
    skillGaps: prioritizedGaps.slice(0, 10), 
  };
};

const simulateSkills = async (currentSkills = [], additionalSkills = [], targetRole = "") => {
  const activeJobs = await Job.find({ status: "ACTIVE" });

  
  const currentMatches = getRecommendedJobs(currentSkills, activeJobs);
  const currentAvg =
    currentMatches.length > 0
      ? Math.round(currentMatches.reduce((sum, j) => sum + j.matchPercentage, 0) / currentMatches.length)
      : 0;

  const currentMatchingJobs = currentMatches.filter((j) => j.matchPercentage > 0).length;

  
  const projectedSkills = [...new Set([...normalizeSkills(currentSkills), ...normalizeSkills(additionalSkills)])];

  
  const projectedMatches = getRecommendedJobs(projectedSkills, activeJobs);
  const projectedAvg =
    projectedMatches.length > 0
      ? Math.round(projectedMatches.reduce((sum, j) => sum + j.matchPercentage, 0) / projectedMatches.length)
      : 0;

  const projectedMatchingJobs = projectedMatches.filter((j) => j.matchPercentage > 0).length;

  
  const currentMatchingJobIds = new Set(
    currentMatches.filter((j) => j.matchPercentage >= 50).map((j) => j.job._id.toString())
  );
  const newlyMatchingJobs = projectedMatches
    .filter((j) => j.matchPercentage >= 50 && !currentMatchingJobIds.has(j.job._id.toString()))
    .slice(0, 5)
    .map(({ job, matchPercentage, missingRequired }) => ({
      jobId: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      matchPercentage,
      remainingGaps: missingRequired,
    }));

  
  let remainingGaps = [];
  if (targetRole) {
    const targetJobs = activeJobs.filter((j) =>
      j.title.toLowerCase().includes(targetRole.toLowerCase())
    );
    if (targetJobs.length > 0) {
      const gaps = getSkillGaps(projectedSkills, targetJobs[0].requiredSkills);
      remainingGaps = gaps;
    }
  }

  return {
    
    currentSkills: normalizeSkills(currentSkills),
    currentAverageMatch: currentAvg,
    currentMatchingJobCount: currentMatchingJobs,

    
    simulatedSkills: normalizeSkills(additionalSkills),
    projectedSkills,

    
    projectedAverageMatch: projectedAvg,
    projectedMatchingJobCount: projectedMatchingJobs,

    
    improvement: projectedAvg - currentAvg,
    additionalJobsUnlocked: projectedMatchingJobs - currentMatchingJobs,

    
    newlyMatchingJobs,
    remainingGaps,
  };
};

const getCareerRoadmap = async (student) => {
  const targetRole = student.targetRole;
  if (!targetRole) {
    return { steps: [], message: "Please set a target role in your profile to generate a roadmap." };
  }

  
  const targetJobs = await Job.find({
    status: "ACTIVE",
    title: { $regex: targetRole, $options: "i" },
  });

  if (targetJobs.length === 0) {
    return { steps: [], message: `No active jobs found for target role: ${targetRole}` };
  }

  
  const requiredSkillsSet = new Set();
  for (const job of targetJobs) {
    for (const skill of job.requiredSkills) {
      requiredSkillsSet.add(skill.toLowerCase().trim());
    }
  }
  const requiredSkills = [...requiredSkillsSet];

  const studentNormalized = normalizeSkills(student.skills || []);

  
  const missingSkills = requiredSkills.filter((s) => !studentNormalized.includes(s));

  
  const steps = [];

  
  for (const skill of requiredSkills) {
    if (studentNormalized.includes(skill)) {
      steps.push({
        skill,
        status: "COMPLETED",
        priority: "DONE",
        description: "Already in your skill set",
      });
    }
  }

  
  for (const skill of missingSkills) {
    
    const prereqs = await getAllPrerequisites(skill);
    const prereqsMet = prereqs.every((p) => studentNormalized.includes(p));

    steps.push({
      skill,
      status: "PENDING",
      priority: prereqsMet ? "HIGH_PRIORITY" : "RECOMMENDED",
      prerequisites: prereqs,
      description: prereqsMet
        ? "Ready to learn — prerequisites complete"
        : `Learn prerequisites first: ${prereqs.join(", ")}`,
    });
  }

  return {
    targetRole,
    totalSteps: steps.length,
    completedSteps: steps.filter((s) => s.status === "COMPLETED").length,
    steps,
    jobsForTargetRole: targetJobs.length,
  };
};

const getOpportunityImpact = async () => {
  const activeJobs = await Job.find({ status: "ACTIVE" });

  const skillJobCount = {};
  for (const job of activeJobs) {
    for (const skill of job.requiredSkills) {
      const normalized = skill.toLowerCase().trim();
      skillJobCount[normalized] = (skillJobCount[normalized] || 0) + 1;
    }
    for (const skill of job.preferredSkills) {
      const normalized = skill.toLowerCase().trim();
      skillJobCount[normalized] = (skillJobCount[normalized] || 0) + 1;
    }
  }

  const impact = Object.entries(skillJobCount)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, jobCount: count }));

  return {
    totalJobs: activeJobs.length,
    skills: impact,
    disclaimer: "Based on opportunities currently available on CareerDrive",
  };
};

module.exports = {
  getCareerProfile,
  simulateSkills,
  getCareerRoadmap,
  getOpportunityImpact,
};
