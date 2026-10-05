const Application = require("../models/Application");
const Job = require("../models/Job");
const { compareStudentWithJob } = require("../services/matchingService");
const { getPagination, paginationResponse } = require("../utils/pagination");

const applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    
    if (job.status !== "ACTIVE") {
      return res.status(400).json({ success: false, message: "This job is no longer accepting applications" });
    }

    
    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({ success: false, message: "Application deadline has passed" });
    }

    
    const matchResult = compareStudentWithJob(req.user.skills, job.requiredSkills, job.preferredSkills);

    
    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      coverLetter: coverLetter || "",
      matchPercentage: matchResult.matchPercentage,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
      matchPercentage: matchResult.matchPercentage,
    });
  } catch (error) {
    
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "You have already applied for this job" });
    }
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status } = req.query;

    const query = { student: req.user._id };
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate({
          path: "job",
          populate: { path: "recruiter", select: "name companyName" },
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query),
    ]);

    res.json({ success: true, ...paginationResponse(applications, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { page, limit, skip } = getPagination(req.query);
    const { status } = req.query;

    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const query = { job: jobId };
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("student", "-password")
        .sort({ matchPercentage: -1, appliedAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query),
    ]);

    res.json({ success: true, ...paginationResponse(applications, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    
    if (
      application.job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, message: `Application status updated to ${status}`, application });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus };
