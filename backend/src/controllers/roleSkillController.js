import RoleSkill from "../models/RoleSkill.js";
import Role from "../models/Role.js";
import Skill from "../models/skillModel.js";

// ➤ Assign a skill to a role
export const addSkillToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { skillId, weight, type } = req.body;

    const role = await Role.findByPk(roleId);
    const skill = await Skill.findByPk(skillId);
    if (!role || !skill)
      return res.status(404).json({ message: "Role or Skill not found" });

    const link = await RoleSkill.create({ roleId, skillId, weight, type });
    res.status(201).json({ message: "Skill linked to role successfully", link });
  } catch (error) {
    console.error("Error linking skill:", error);
    res.status(500).json({ message: "Error linking skill", error });
  }
};

// ➤ Get all skills of a role
export const getSkillsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await Role.findByPk(roleId, { include: Skill });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    console.error("Error fetching role skills:", error);
    res.status(500).json({ message: "Error fetching role skills", error });
  }
};
