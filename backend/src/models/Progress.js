import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
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
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Mastered"],
    default: "Not Started"
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  milestones: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date }
  }]
}, {
  timestamps: true
});

// Create indexes for better performance
progressSchema.index({ userId: 1, skillName: 1 }, { unique: true });
progressSchema.index({ status: 1 });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
