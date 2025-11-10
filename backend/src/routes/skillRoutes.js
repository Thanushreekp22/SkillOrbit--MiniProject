import express from "express";
import {
  addSkill,
  getAllSkills,
  getSkillsByUser,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.post("/", verifyToken, addSkill);          // POST /api/skills
router.get("/", verifyToken, getAllSkills);       // GET /api/skills (with optional userId query)
router.get("/user/:userId", verifyToken, getSkillsByUser); // GET /api/skills/user/:userId
router.put("/:id", verifyToken, updateSkill);     // PUT /api/skills/:id
router.delete("/:id", verifyToken, deleteSkill);  // DELETE /api/skills/:id

export default router;
