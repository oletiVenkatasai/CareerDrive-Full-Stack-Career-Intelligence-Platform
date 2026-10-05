const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Programming",
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Cloud",
        "Data Science",
        "Mobile",
        "Testing",
        "Security",
        "Soft Skills",
        "Other",
      ],
      default: "Other",
    },
    description: { type: String, default: "" },
    icon: { type: String, default: "" }, // Optional icon class or URL
  },
  { timestamps: true }
);

// Note: name index is already created by unique:true on the field above
skillSchema.index({ category: 1 });

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
