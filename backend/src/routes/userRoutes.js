import express from "express";
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserDashboard,
  updateUserProfile,
  getUserProfile 
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (only accessible with valid JWT)
router.get("/", verifyToken, getAllUsers);
router.get("/:id/dashboard", verifyToken, getUserDashboard);
router.get("/:id/profile", verifyToken, getUserProfile);
router.put("/:id/profile", verifyToken, updateUserProfile);

export default router;
