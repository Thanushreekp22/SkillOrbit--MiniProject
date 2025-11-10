import express from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionsBySkill,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  getQuestionStats
} from "../controllers/questionBankController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (for assessments)
router.get("/skill/:skillName", getQuestionsBySkill);     // GET /api/question-bank/skill/:skillName

// Protected routes (require authentication)
router.use(verifyToken);

// Question management
router.post("/", createQuestion);                         // POST /api/question-bank
router.post("/bulk", bulkCreateQuestions);               // POST /api/question-bank/bulk
router.get("/", getAllQuestions);                        // GET /api/question-bank
router.get("/stats", getQuestionStats);                  // GET /api/question-bank/stats
router.get("/:id", getQuestionById);                     // GET /api/question-bank/:id
router.put("/:id", updateQuestion);                      // PUT /api/question-bank/:id
router.delete("/:id", deleteQuestion);                   // DELETE /api/question-bank/:id

export default router;
