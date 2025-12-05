import express from "express";
import {
  adminLogin,
  createAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  toggleAdminStatus,
  getAdminActivity,
  getMyActivity,
  getAdminStatistics,
  unlockAdminAccount,
  getDashboardStats,
  getRecentUsers,
  getAllUsers,
  getUserDetails,
  deleteUser
} from "../controllers/adminController.js";
import { verifyAdminToken, checkSuperAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes (require admin authentication)
router.get("/profile", verifyAdminToken, getAdminProfile);
router.put("/profile", verifyAdminToken, updateAdminProfile);
router.put("/change-password", verifyAdminToken, changeAdminPassword);
router.get("/my-activity", verifyAdminToken, getMyActivity);

// Debug endpoint to check token permissions
router.get("/check-token", verifyAdminToken, (req, res) => {
  res.json({
    tokenData: req.user,
    message: "Token is valid"
  });
});

// Dashboard routes (all authenticated admins)
router.get("/dashboard/stats", verifyAdminToken, getDashboardStats);
router.get("/dashboard/recent-users", verifyAdminToken, getRecentUsers);
router.get("/dashboard/users", verifyAdminToken, getAllUsers);
router.get("/dashboard/users/:userId", verifyAdminToken, getUserDetails);
router.delete("/dashboard/users/:userId", verifyAdminToken, deleteUser);

// Super admin only routes
router.post("/create", verifyAdminToken, checkSuperAdmin, createAdmin);
router.get("/all", verifyAdminToken, checkSuperAdmin, getAllAdmins);
router.get("/statistics", verifyAdminToken, checkSuperAdmin, getAdminStatistics);
router.get("/activity/:adminId", verifyAdminToken, checkSuperAdmin, getAdminActivity);
router.put("/toggle-status/:adminId", verifyAdminToken, checkSuperAdmin, toggleAdminStatus);
router.put("/unlock/:adminId", verifyAdminToken, checkSuperAdmin, unlockAdminAccount);

export default router;
