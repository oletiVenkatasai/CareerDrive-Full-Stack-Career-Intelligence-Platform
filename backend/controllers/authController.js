const { body } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { validate } = require("../middleware/validationMiddleware");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["STUDENT", "RECRUITER"]).withMessage("Role must be STUDENT or RECRUITER"),
  validate,
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, companyName } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || "",
      companyName: role === "RECRUITER" ? companyName : undefined,
    });

    
    user.profileCompletion = user.calculateProfileCompletion();
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompletion: user.profileCompletion,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        targetRole: user.targetRole,
        profileCompletion: user.profileCompletion,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = { register, login, getMe, registerValidation, loginValidation };
