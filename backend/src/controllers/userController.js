import { User, Skill, Assessment, Progress, LearningPath, AILearningPath, Analysis, Report, UserQuestionnaire } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from "../services/emailService.js";
dotenv.config();

// ✅ Register - Send OTP for email verification
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.isEmailVerified) {
        return res.status(400).json({ message: "User already exists with this email" });
      } else {
        // User exists but email not verified - resend OTP
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existing.emailVerificationOTP = otp;
        existing.otpExpiresAt = otpExpiresAt;
        await existing.save();

        await sendOTPEmail(email, otp, existing.name);

        return res.status(200).json({ 
          message: "OTP resent to your email. Please verify to complete registration.",
          userId: existing._id,
          email: existing.email,
          requiresVerification: true
        });
      }
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create user with unverified email
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role,
      isEmailVerified: false,
      emailVerificationOTP: otp,
      otpExpiresAt
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.status(201).json({ 
      message: "Registration successful! Please check your email for OTP verification.", 
      userId: user._id,
      email: user.email,
      requiresVerification: true
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Generate token for immediate login
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES || "24h" }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationOTP;
    delete userResponse.otpExpiresAt;

    res.json({ 
      message: "Email verified successfully! Welcome to SkillOrbit!", 
      user: userResponse,
      token
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationOTP = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send new OTP
    await sendOTPEmail(user.email, otp, user.name);

    res.json({ 
      message: "New OTP sent to your email successfully"
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login - Check email verification
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: "Please verify your email before logging in",
        requiresVerification: true,
        userId: user._id
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES || "24h" }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationOTP;
    delete userResponse.otpExpiresAt;

    res.json({ 
      message: "Login successful", 
      token,
      user: userResponse 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all users (protected route)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get user dashboard data
export const getUserDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const skills = await Skill.find({ userId: id }).sort({ proficiency: -1 });
    
    const totalSkills = skills.length;
    const masteredSkills = skills.filter(skill => skill.proficiency >= 80).length;
    const inProgressSkills = skills.filter(skill => skill.proficiency > 0 && skill.proficiency < 80).length;
    const averageProficiency = totalSkills > 0 
      ? Math.round(skills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills)
      : 0;

    // Group skills by category
    const mongoose = await import('mongoose');
    const skillsByCategory = await Skill.aggregate([
      { $match: { userId: new mongoose.default.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgProficiency: { $avg: '$proficiency' }
        }
      }
    ]);

    res.json({
      totalSkills,
      masteredSkills,
      inProgressSkills,
      averageProficiency,
      skills: skills.slice(0, 10), // Top 10 skills for charts
      skillsByCategory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upload Profile Photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Convert image to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const user = await User.findByIdAndUpdate(
      id,
      { profilePhoto: base64Image },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Profile photo updated successfully",
      profilePhoto: user.profilePhoto,
      user 
    });
  } catch (err) {
    console.error("Upload profile photo error:", err);
    res.status(500).json({ message: "Error uploading profile photo", error: err.message });
  }
};

// ✅ Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      location,
      bio,
      education,
      currentRole,
      company,
      linkedIn,
      github,
      portfolio,
    } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user fields
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      location: location !== undefined ? location : user.location,
      bio: bio !== undefined ? bio : user.bio,
      education: education !== undefined ? education : user.education,
      currentRole: currentRole !== undefined ? currentRole : user.currentRole,
      company: company !== undefined ? company : user.company,
      linkedIn: linkedIn !== undefined ? linkedIn : user.linkedIn,
      github: github !== undefined ? github : user.github,
      portfolio: portfolio !== undefined ? portfolio : user.portfolio,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, otherReason } = req.body;

    // Verify user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the deletion reason (optional - for analytics)
    console.log(`User ${user.email} deleted account. Reason: ${reason === 'other' ? otherReason : reason}`);

    // Delete all user-related data
    await Promise.all([
      UserQuestionnaire.deleteMany({ userId: id }),
      Assessment.deleteMany({ userId: id }),
      Progress.deleteMany({ userId: id }),
      LearningPath.deleteMany({ userId: id }),
      AILearningPath.deleteMany({ userId: id }),
      Analysis.deleteMany({ userId: id }),
      Report.deleteMany({ userId: id }),
      Skill.deleteMany({ userId: id }),
      User.findByIdAndDelete(id)
    ]);

    res.json({ 
      message: "Account deleted successfully. We're sorry to see you go!",
      reason: reason === 'other' ? otherReason : reason
    });
  } catch (err) {
    console.error("Error deleting user account:", err);
    res.status(500).json({ error: err.message });
  }
};
