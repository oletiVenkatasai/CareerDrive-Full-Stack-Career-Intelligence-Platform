const { body } = require("express-validator");
const Job = require("../models/Job");
const { validate } = require("../middleware/validationMiddleware");
const { compareStudentWithJob } = require("../services/matchingService");
const { getPagination, paginationResponse } = require("../utils/pagination");

const jobValidation = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("description").trim().notEmpty().withMessage("Job description is required"),
  body("requiredSkills").isArray({ min: 1 }).withMessage("At least one required skill is needed"),
  body("deadline").isISO8601().withMessage("Valid deadline date is required"),
  validate,
];

const getJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const {
      search, location, employmentType, experience, skills,
      status = "ACTIVE", sortBy = "createdAt", sortOrder = "desc",
    } = req.query;

    const query = {};

    
    if (req.user && req.user.role === "RECRUITER") {
      
      query.recruiter = req.user._id;
      if (status) query.status = status;
    } else {
      query.status = "ACTIVE";
    }

    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { requiredSkills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    
    if (employmentType) {
      query.employmentType = employmentType;
    }

    
    if (experience) {
      query.experienceRequired = { $regex: experience, $options: "i" };
    }

    
    if (skills) {
      const skillList = skills.split(",").map((s) => s.trim());
      query.requiredSkills = { $in: skillList.map((s) => new RegExp(s, "i")) };
    }

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [jobs, total] = await Promise.all([
      Job.find(query).populate("recruiter", "name companyName email").sort(sort).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      ...paginationResponse(jobs, total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "name companyName email");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    
    let matchDetails = null;
    if (req.user && req.user.role === "STUDENT") {
      matchDetails = compareStudentWithJob(req.user.skills, job.requiredSkills, job.preferredSkills);
    }

    res.json({ success: true, job, matchDetails });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      recruiter: req.user._id,
      company: req.body.company || req.user.companyName || req.user.name,
    };

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, message: "Job created successfully", job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only edit your own jobs" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: "Job updated", job: updatedJob });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, jobValidation };
