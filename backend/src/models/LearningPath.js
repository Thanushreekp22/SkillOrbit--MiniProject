import mongoose from "mongoose";

const learningPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  recommendedResources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ["video", "article", "course", "book", "practice"], required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    estimatedTime: { type: String },
    description: { type: String }
  }],
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  }
}, {
  timestamps: true
});

// Create indexes for better performance
learningPathSchema.index({ userId: 1, skillName: 1 });
learningPathSchema.index({ status: 1 });

const LearningPath = mongoose.model("LearningPath", learningPathSchema);

export default LearningPath;
