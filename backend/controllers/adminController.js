const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Skill = require("../models/Skill");
const SkillDependency = require("../models/SkillDependency");
const { getPagination, paginationResponse } = require("../utils/pagination");

const getDashboard = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
    ] = await Promise.all([
      User.countDocuments({ role: "STUDENT" }),
      User.countDocuments({ role: "RECRUITER" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "ACTIVE" }),
      Application.countDocuments(),
    ]);

    
    const statusBreakdown = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applicationsTrend = await Application.aggregate([
      { $match: { appliedAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$appliedAt" },
            month: { $month: "$appliedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    
    const skillDemand = await Job.aggregate([
      { $match: { status: "ACTIVE" } },
      { $unwind: "$requiredSkills" },
      { $group: { _id: { $toLower: "$requiredSkills" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    
    const jobsByLocation = await Job.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        summary: { totalStudents, totalRecruiters, totalJobs, activeJobs, totalApplications },
        statusBreakdown: statusBreakdown.map((s) => ({ status: s._id, count: s.count })),
        applicationsTrend,
        skillDemand: skillDemand.map((s) => ({ skill: s._id, count: s.count })),
        jobsByLocation: jobsByLocation.map((j) => ({ location: j._id, count: j.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    res.json({ success: true, ...paginationResponse(users, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const [jobs, total] = await Promise.all([
      Job.find(query).populate("recruiter", "name companyName").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    res.json({ success: true, ...paginationResponse(jobs, total, page, limit) });
  } catch (error) {
    next(error);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("student", "name email skills")
        .populate({ path: "job", populate: { path: "recruiter", select: "name companyName" } })
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

const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;
    const skill = await Skill.create({ name, category, description });
    res.status(201).json({ success: true, message: "Skill created", data: skill });
  } catch (error) {
    next(error);
  }
};

const createSkillDependency = async (req, res, next) => {
  try {
    const { skill, prerequisite, relationshipType, order } = req.body;
    const dep = await SkillDependency.create({ skill, prerequisite, relationshipType, order });
    res.status(201).json({ success: true, message: "Dependency created", data: dep });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  toggleUserStatus,
  getAllJobs,
  getAllApplications,
  getSkills,
  createSkill,
  createSkillDependency,
};
