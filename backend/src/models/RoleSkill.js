import mongoose from "mongoose";

const roleSkillSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
  roleName: {
    type: String,
    required: true,
    trim: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    default: 50,
    min: 1,
    max: 100
  },
  type: {
    type: String,
    default: "technical",
    enum: ["technical", "soft", "core", "optional"]
  },
  priority: {
    type: String,
    default: "medium",
    enum: ["high", "medium", "low"]
  },
  requiredProficiency: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Create compound index for better performance
roleSkillSchema.index({ roleId: 1, skillName: 1 }, { unique: true });

const RoleSkill = mongoose.model("RoleSkill", roleSkillSchema);

export default RoleSkill;
