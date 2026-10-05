const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"],
      default: "APPLIED",
    },
    coverLetter: { type: String, default: "" },
    matchPercentage: { type: Number, default: 0 }, // Stored at application time
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound unique index — prevents duplicate applications
// One student can apply to one job exactly once
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

// Additional indexes for query performance
applicationSchema.index({ student: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
