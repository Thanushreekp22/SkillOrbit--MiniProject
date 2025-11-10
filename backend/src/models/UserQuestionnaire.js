import mongoose from "mongoose";

const userQuestionnaireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionBank",
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  attemptNumber: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Create indexes for better performance
userQuestionnaireSchema.index({ userId: 1, questionId: 1 });
userQuestionnaireSchema.index({ userId: 1, createdAt: -1 });

const UserQuestionnaire = mongoose.model("UserQuestionnaire", userQuestionnaireSchema);

export default UserQuestionnaire;
