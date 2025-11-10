import express from "express";
import {
  generateQuestionnaire,
  getUserQuestionnaire,
} from "../controllers/questionnaireController.js";

const router = express.Router();

// Generate a questionnaire for a user
router.post("/generate/:userId", generateQuestionnaire);

// Get all questions in user’s questionnaire
router.get("/:userId", getUserQuestionnaire);

export default router;
