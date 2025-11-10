import mongoose from "mongoose";

const questionBankSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["basic", "intermediate", "advanced"],
    default: "basic"
  },
  questionType: {
    type: String,
    enum: ["multiple-choice", "true-false", "short-answer"],
    default: "multiple-choice"
  }
}, {
  timestamps: true
});

// Create indexes for better performance
questionBankSchema.index({ skillName: 1, difficulty: 1 });

const QuestionBank = mongoose.model("QuestionBank", questionBankSchema);

export default QuestionBank;
