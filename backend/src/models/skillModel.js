import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  proficiency: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
skillSchema.index({ userId: 1 });
skillSchema.index({ name: 1, userId: 1 }, { unique: true });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
