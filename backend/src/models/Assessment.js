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
    enum: ["basic", "intermediate", "advanced", "expert"],
    default: "basic"
  },
  status: {
    type: String,
    enum: ["in_progress", "completed", "abandoned"],
    default: "completed"
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionBank"
    },
    questionText: String, // For AI-generated questions
    questionType: {
      type: String,
      enum: ["mcq", "true-false", "short-answer", "practical", "code-typing", "code-mcq"],
      default: "mcq"
    },
    options: [String], // For MCQ, True/False, and Code-MCQ
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number,
    explanation: String // AI-generated explanation
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
