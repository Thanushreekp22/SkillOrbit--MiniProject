import mongoose from 'mongoose';

const aiLearningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  selectedSkills: [{
    type: String
  }],
  targetRole: {
    type: String,
    default: ''
  },
  currentLevel: {
    type: String,
    default: 'Intermediate'
  },
  aiResponse: {
    type: String,
    required: true
  },
  sections: {
    type: Map,
    of: String
  },
  resources: [{
    title: String,
    url: String,
    type: String // 'course', 'documentation', 'tutorial', 'video', 'article'
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
aiLearningPathSchema.index({ user: 1, createdAt: -1 });

const AILearningPath = mongoose.model('AILearningPath', aiLearningPathSchema);

export default AILearningPath;
