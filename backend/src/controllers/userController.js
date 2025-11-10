import { User, Skill } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES || "24h" }
    );

    res.status(201).json({ 
      message: "User registered successfully", 
      user: userResponse,
      token 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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
