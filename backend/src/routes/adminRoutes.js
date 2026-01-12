import express from "express";
import {
  adminLogin,
  getAdminProfile,
  changeAdminPassword
} from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes (require admin authentication)
router.get("/profile", verifyAdminToken, getAdminProfile);
router.put("/change-password", verifyAdminToken, changeAdminPassword);

export default router;
