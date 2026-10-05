const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name", "phone", "location", "education", "experience",
      "skills", "targetRole", "preferredLocation", "preferredEmploymentType",
      "resumeUrl", "companyName", "companyWebsite", "companyDescription",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    
    user.profileCompletion = user.calculateProfileCompletion();
    await user.save();

    res.json({ success: true, message: "Profile updated", user });
  } catch (error) {
    next(error);
  }
};

const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: "Skills must be an array" });
    }

    
    const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills: cleanSkills },
      { new: true }
    );

    user.profileCompletion = user.calculateProfileCompletion();
    await user.save();

    res.json({ success: true, message: "Skills updated", skills: user.skills, profileCompletion: user.profileCompletion });
  } catch (error) {
    next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    
    
    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl: fileUrl },
      { new: true }
    );
    
    res.json({ success: true, message: "Resume uploaded successfully", resumeUrl: fileUrl, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateSkills, uploadResume };
