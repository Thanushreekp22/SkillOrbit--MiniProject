import express from "express";
import {
  startAssessment,
  submitAssessment,
  getUserAssessments,
  getAssessmentDetails,
  getAssessmentStats
} from "../controllers/assessmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All assessment routes require authentication
router.use(verifyToken);

// Assessment management
router.post("/start", startAssessment);                    // POST /api/assessment/start
router.post("/:assessmentId/submit", submitAssessment);    // POST /api/assessment/:id/submit
router.get("/history", getUserAssessments);               // GET /api/assessment/history
router.get("/stats", getAssessmentStats);                 // GET /api/assessment/stats
router.get("/:assessmentId", getAssessmentDetails);       // GET /api/assessment/:id

export default router;
