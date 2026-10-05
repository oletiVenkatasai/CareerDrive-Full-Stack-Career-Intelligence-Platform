const { normalizeSkill, normalizeSkills } = require("../utils/normalizeSkill");

const compareStudentWithJob = (studentSkills = [], requiredSkills = [], preferredSkills = []) => {
  
  const normalizedStudent = normalizeSkills(studentSkills);
  const normalizedRequired = normalizeSkills(requiredSkills);
  const normalizedPreferred = normalizeSkills(preferredSkills);

  
  const matchedRequired = normalizedRequired.filter((skill) =>
    normalizedStudent.includes(skill)
  );

  
  const missingRequired = normalizedRequired.filter((skill) =>
    !normalizedStudent.includes(skill)
  );

  
  const matchedPreferred = normalizedPreferred.filter((skill) =>
    normalizedStudent.includes(skill)
  );

  
  const matchPercentage =
    normalizedRequired.length > 0
      ? Math.round((matchedRequired.length / normalizedRequired.length) * 100)
      : 0;

  return {
    matchPercentage,
    matchedRequired,   
    missingRequired,   
    matchedPreferred,  
    totalRequired: normalizedRequired.length,
    totalMatched: matchedRequired.length,
  };
};

const getRecommendedJobs = (studentSkills = [], jobs = []) => {
  const results = jobs.map((job) => {
    const matchResult = compareStudentWithJob(
      studentSkills,
      job.requiredSkills,
      job.preferredSkills
    );
    return {
      job,
      ...matchResult,
    };
  });

  
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return results;
};

const getSkillGaps = (studentSkills = [], requiredSkills = []) => {
  const normalizedStudent = normalizeSkills(studentSkills);
  const normalizedRequired = normalizeSkills(requiredSkills);

  return normalizedRequired.filter((skill) => !normalizedStudent.includes(skill));
};

module.exports = {
  compareStudentWithJob,
  getRecommendedJobs,
  getSkillGaps,
  normalizeSkill,
  normalizeSkills,
};
