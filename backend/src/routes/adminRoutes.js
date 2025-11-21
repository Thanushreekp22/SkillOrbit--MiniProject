import express from "express";
import {
  adminLogin,
  createAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  toggleAdminStatus
} from "../controllers/adminController.js";
import { verifyAdminToken, checkSuperAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes (require admin authentication)
router.get("/profile", verifyAdminToken, getAdminProfile);
router.put("/profile", verifyAdminToken, updateAdminProfile);
router.put("/change-password", verifyAdminToken, changeAdminPassword);

// Super admin only routes
router.post("/create", verifyAdminToken, checkSuperAdmin, createAdmin);
router.get("/all", verifyAdminToken, checkSuperAdmin, getAllAdmins);
router.put("/toggle-status/:adminId", verifyAdminToken, checkSuperAdmin, toggleAdminStatus);

export default router;
