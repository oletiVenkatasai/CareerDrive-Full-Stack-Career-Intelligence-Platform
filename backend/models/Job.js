const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requiredSkills: {
      type: [String],
      required: [true, "At least one required skill is needed"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one required skill must be specified",
      },
    },
    preferredSkills: { type: [String], default: [] },
    experienceRequired: { type: String, default: "0" }, 
    location: { type: String, trim: true, default: "Remote" },
    employmentType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract"],
      default: "Full Time",
    },
    salary: { type: String, default: "Not Disclosed" }, 
    deadline: { type: Date, required: [true, "Application deadline is required"] },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED", "DRAFT"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text" }); 
jobSchema.index({ location: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ employmentType: 1 });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
