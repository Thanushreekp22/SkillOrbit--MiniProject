import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  targetRole: {
    type: String,
    required: true,
    trim: true
  },
  currentSkills: [{
    name: String,
    proficiency: Number
  }],
  requiredSkills: [{
    name: String,
    requiredProficiency: Number
  }],
  gaps: [{
    skillName: String,
    currentProficiency: Number,
    requiredProficiency: Number,
    gapValue: Number,
    gapPercentage: Number,
    completionPercentage: Number,
    priority: String,
    status: String
  }],
  recommendations: [{
    skillName: String,
    recommendation: String,
    priority: String
  }],
  readinessScore: {
    type: Number,
    min: 0,
    max: 100
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better performance
analysisSchema.index({ userId: 1, targetRole: 1 });
analysisSchema.index({ analyzedAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
