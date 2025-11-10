import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportType: {
    type: String,
    enum: ["skill_gap_analysis", "learning_path", "progress_summary", "readiness_assessment"],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  reportData: {
    overallScore: { type: Number, min: 0, max: 100 },
    skillsAnalyzed: { type: Number, default: 0 },
    skillsGaps: [{
      skillName: String,
      currentLevel: Number,
      requiredLevel: Number,
      gap: Number,
      priority: { type: String, enum: ["low", "medium", "high"] }
    }],
    recommendations: [String],
    roleAnalyzed: String,
    additionalData: mongoose.Schema.Types.Mixed
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["generated", "viewed", "downloaded"],
    default: "generated"
  }
}, {
  timestamps: true
});

// Create indexes for better performance
reportSchema.index({ userId: 1, generatedAt: -1 });
reportSchema.index({ reportType: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
