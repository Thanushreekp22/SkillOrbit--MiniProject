import Skill from "../models/skillModel.js";
import User from "../models/User.js";

// ➤ Add new skill for a user
export const addSkill = async (req, res) => {
  try {
    const { userId, name, category, proficiency } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "User ID and skill name are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({ userId, name });
    if (existingSkill) {
      return res.status(400).json({ message: "Skill already exists for this user" });
    }

    const skill = await Skill.create({
      userId,
      name,
      category,
      proficiency: proficiency || 0,
    });

    res.status(201).json({ message: "Skill added successfully", skill });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ message: "Error adding skill", error: error.message });
  }
};

// ➤ Get all skills (with optional userId filter)
export const getAllSkills = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    
    const skills = await Skill.find(filter).populate('userId', 'name email');
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Error fetching skills", error: error.message });
  }
};

// ➤ Get all skills for a specific user
export const getSkillsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await Skill.find({ userId });
    res.json({ skills, total: skills.length });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ message: "Error fetching skills", error: error.message });
  }
};

// ➤ Update an existing skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency } = req.body;

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Update fields
    if (name) skill.name = name;
    if (category !== undefined) skill.category = category;
    if (proficiency !== undefined) skill.proficiency = proficiency;

    await skill.save();
    res.json({ message: "Skill updated successfully", skill });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ message: "Error updating skill", error: error.message });
  }
};

// ➤ Delete a skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    await Skill.findByIdAndDelete(id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ message: "Error deleting skill", error: error.message });
  }
};
