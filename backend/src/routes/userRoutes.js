import express from "express";
import multer from "multer";
import { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserDashboard,
  updateUserProfile,
  getUserProfile,
  deleteUserAccount,
  verifyOTP,
  resendOTP,
  uploadProfilePhoto
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);

// Protected routes (only accessible with valid JWT)
router.get("/", verifyToken, getAllUsers);
router.get("/:id/dashboard", verifyToken, getUserDashboard);
router.get("/:id/profile", verifyToken, getUserProfile);
router.put("/:id/profile", verifyToken, updateUserProfile);
router.post("/:id/profile-photo", verifyToken, upload.single('profilePhoto'), uploadProfilePhoto);
router.delete("/:id/account", verifyToken, deleteUserAccount);

export default router;
