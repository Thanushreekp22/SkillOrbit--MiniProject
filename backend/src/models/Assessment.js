import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  feedback: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ["basic", "intermediate", "advanced"],
    default: "basic"
  },
  status: {
    type: String,
    enum: ["in_progress", "completed", "abandoned"],
    default: "completed"
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionBank"
    },
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }]
}, {
  timestamps: true
});

// Create indexes for better performance
assessmentSchema.index({ userId: 1, skillName: 1 });
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ score: -1 });

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
