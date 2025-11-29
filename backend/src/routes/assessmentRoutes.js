import express from "express";
import {
  startAssessment,
  submitAssessment,
  getUserAssessments,
  getAssessmentDetails,
  getAssessmentStats,
  generateExpertAssessment,
  submitExpertAssessment
} from "../controllers/assessmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All assessment routes require authentication
router.use(verifyToken);

// Expert Level AI-Generated Assessments (MUST BE BEFORE :assessmentId routes)
router.post("/expert/generate", generateExpertAssessment);           // POST /api/assessment/expert/generate
router.post("/expert/:assessmentId/submit", submitExpertAssessment); // POST /api/assessment/expert/:id/submit

// Assessment management
router.post("/start", startAssessment);                    // POST /api/assessment/start
router.post("/:assessmentId/submit", submitAssessment);    // POST /api/assessment/:id/submit
router.get("/history", getUserAssessments);               // GET /api/assessment/history
router.get("/stats", getAssessmentStats);                 // GET /api/assessment/stats
router.get("/:assessmentId", getAssessmentDetails);       // GET /api/assessment/:id

export default router;
