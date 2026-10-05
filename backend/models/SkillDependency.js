const mongoose = require("mongoose");

const skillDependencySchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    prerequisite: {
      type: String,
      required: [true, "Prerequisite skill name is required"],
      trim: true,
    },
    relationshipType: {
      type: String,
      enum: ["PREREQUISITE", "RECOMMENDED", "OPTIONAL"],
      default: "PREREQUISITE",
    },
    order: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

skillDependencySchema.index({ skill: 1, prerequisite: 1 }, { unique: true });
skillDependencySchema.index({ skill: 1 });
skillDependencySchema.index({ prerequisite: 1 });

const SkillDependency = mongoose.model("SkillDependency", skillDependencySchema);
module.exports = SkillDependency;
