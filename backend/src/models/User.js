import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  // Profile Information
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  currentRole: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  // Social Links
  linkedIn: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  // Profile Photo
  profilePhoto: {
    type: String, // Base64 encoded image or URL
    default: ''
  },
  // Email Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationOTP: {
    type: String
  },
  otpExpiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
