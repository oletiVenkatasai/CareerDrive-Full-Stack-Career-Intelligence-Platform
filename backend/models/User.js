const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, 
    },
    role: {
      type: String,
      enum: ["STUDENT", "RECRUITER", "ADMIN"],
      required: [true, "Role is required"],
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },

    
    education: { type: String, trim: true },
    experience: { type: String, trim: true },
    skills: [{ type: String, trim: true }], 
    targetRole: { type: String, trim: true }, 
    preferredLocation: { type: String, trim: true },
    preferredEmploymentType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract", ""],
      default: "",
    },
    resumeUrl: { type: String, trim: true },
    profileCompletion: { type: Number, default: 0 }, // 0-100

    // Recruiter-specific fields
    companyName: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },
    companyDescription: { type: String, trim: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook: Hash password before saving
userSchema.pre("save", async function () {
  
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.calculateProfileCompletion = function () {
  const fields = ["name", "email", "phone", "location", "education", "experience", "targetRole", "resumeUrl"];
  const filled = fields.filter((f) => this[f] && this[f].toString().trim() !== "");
  const skillsScore = this.skills && this.skills.length > 0 ? 1 : 0;
  return Math.round(((filled.length + skillsScore) / (fields.length + 1)) * 100);
};

// Indexes for performance
// Note: email index is already created by unique:true on the field above
userSchema.index({ role: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ targetRole: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
