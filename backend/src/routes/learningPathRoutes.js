import express from "express";
import { 
  generateLearningPath, 
  generateAILearningPath,
  getSkillRecommendation,
  analyzeAssessment,
  checkAIStatus,
  saveAILearningPath,
  getSavedLearningPaths,
  getLearningPathById,
  deleteLearningPath,
  updateLearningPath
} from "../controllers/learningPathController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Original learning path generation
router.post("/generate", generateLearningPath); // POST /api/learning-path/generate

// AI-powered endpoints
router.post("/ai-generate", verifyToken, generateAILearningPath); // POST /api/learning-path/ai-generate
router.post("/skill-recommendation", verifyToken, getSkillRecommendation); // POST /api/learning-path/skill-recommendation
router.post("/analyze-assessment", verifyToken, analyzeAssessment); // POST /api/learning-path/analyze-assessment
router.get("/ai-status", verifyToken, checkAIStatus); // GET /api/learning-path/ai-status

// Save and manage AI learning paths
router.post("/save", verifyToken, saveAILearningPath); // POST /api/learning-path/save
router.get("/saved", verifyToken, getSavedLearningPaths); // GET /api/learning-path/saved
router.get("/saved/:id", verifyToken, getLearningPathById); // GET /api/learning-path/saved/:id
router.put("/saved/:id", verifyToken, updateLearningPath); // PUT /api/learning-path/saved/:id
router.delete("/saved/:id", verifyToken, deleteLearningPath); // DELETE /api/learning-path/saved/:id

export default router;
