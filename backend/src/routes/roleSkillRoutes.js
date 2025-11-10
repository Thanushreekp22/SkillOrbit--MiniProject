import express from "express";
import { addSkillToRole, getSkillsByRole } from "../controllers/roleSkillController.js";

const router = express.Router();

router.post("/:roleId/skills", addSkillToRole);  // POST /api/roles/:roleId/skills
router.get("/:roleId/skills", getSkillsByRole);  // GET  /api/roles/:roleId/skills

export default router;
