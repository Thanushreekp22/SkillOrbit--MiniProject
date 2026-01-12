import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStatistics
} from "../controllers/adminQuestionController.js";
import {
  getDashboardStats,
  getRecentUsers,
  getAllUsers,
  getUserDetails,
  deleteUser
} from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(verifyAdminToken);

// Dashboard Stats Routes - Basic Analytics
router.get("/stats", getDashboardStats);
router.get("/recent-users", getRecentUsers);

// User Management Routes - For Support
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.delete("/users/:userId", deleteUser);

// Question Management Routes - Core Feature
router.get("/questions", getAllQuestions);
router.get("/questions/statistics", getQuestionStatistics);
router.get("/questions/:id", getQuestionById);
router.post("/questions", addQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
