import express from "express";
import {
  getAllQuestions,
  getQuestionById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  bulkAddQuestions,
  getQuestionStatistics,
  getPlatformAnalytics,
  getUserManagementData,
  exportQuestions
} from "../controllers/adminQuestionController.js";
import {
  getDashboardStats,
  getRecentUsers,
  getAllUsers,
  getUserDetails,
  deleteUser
} from "../controllers/adminController.js";
import { verifyAdminToken, checkPermission } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(verifyAdminToken);

// Dashboard Stats Routes
router.get("/stats", getDashboardStats);
router.get("/recent-users", getRecentUsers);

// User Management Routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.delete("/users/:userId", deleteUser);

// Question Management Routes (require manageQuestions permission)
router.get("/questions", checkPermission('manageQuestions'), getAllQuestions);
router.get("/questions/statistics", checkPermission('viewAnalytics'), getQuestionStatistics);
router.get("/questions/export", checkPermission('manageQuestions'), exportQuestions);
router.get("/questions/:id", checkPermission('manageQuestions'), getQuestionById);
router.post("/questions", checkPermission('manageQuestions'), addQuestion);
router.post("/questions/bulk", checkPermission('manageQuestions'), bulkAddQuestions);
router.put("/questions/:id", checkPermission('manageQuestions'), updateQuestion);
router.delete("/questions/:id", checkPermission('manageQuestions'), deleteQuestion);

// Analytics Routes (require viewAnalytics permission)
router.get("/analytics", checkPermission('viewAnalytics'), getPlatformAnalytics);

export default router;
