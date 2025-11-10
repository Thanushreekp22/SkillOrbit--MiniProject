import express from "express";
import {
  analyzeSkillGap,
  getUserAnalyses,
  getAnalysisById,
  getAvailableRoles,
  getSkillRecommendations
} from "../controllers/analysisController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Analysis routes
router.post("/analyze", analyzeSkillGap);                    // POST /api/analysis/analyze
router.get("/history", getUserAnalyses);                     // GET /api/analysis/history
router.get("/roles", getAvailableRoles);                     // GET /api/analysis/roles
router.get("/recommendations", getSkillRecommendations);     // GET /api/analysis/recommendations
router.get("/:analysisId", getAnalysisById);                 // GET /api/analysis/:id

export default router;
