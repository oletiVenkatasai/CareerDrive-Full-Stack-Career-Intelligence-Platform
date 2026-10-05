const Job = require("../models/Job");
const { getRecommendedJobs } = require("./matchingService");

const getJobRecommendations = async (student, options = {}) => {
  const { limit = 10 } = options;

  
  const query = { status: "ACTIVE" };

  
  if (student.targetRole) {
    query.title = { $regex: student.targetRole.split(" ").slice(-1)[0], $options: "i" };
  }

  
  if (student.preferredLocation && student.preferredLocation !== "") {
    query.$or = [
      { location: { $regex: student.preferredLocation, $options: "i" } },
      { location: "Remote" },
    ];
  }

  
  if (student.preferredEmploymentType && student.preferredEmploymentType !== "") {
    query.employmentType = student.preferredEmploymentType;
  }

  const jobs = await Job.find(query).populate("recruiter", "name companyName").limit(100);

  
  let allJobs = jobs;
  if (jobs.length < 5) {
    allJobs = await Job.find({ status: "ACTIVE" }).populate("recruiter", "name companyName").limit(100);
  }

  
  const rankedJobs = getRecommendedJobs(student.skills || [], allJobs);

  
  return rankedJobs.slice(0, limit).map(({ job, matchPercentage, matchedRequired, missingRequired, matchedPreferred }) => ({
    job: {
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      employmentType: job.employmentType,
      salary: job.salary,
      deadline: job.deadline,
      requiredSkills: job.requiredSkills,
      preferredSkills: job.preferredSkills,
    },
    matchPercentage,
    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    matchedPreferredSkills: matchedPreferred,
    reason: `Matches ${matchedRequired.length} of ${job.requiredSkills.length} required skills`,
  }));
};

module.exports = { getJobRecommendations };
