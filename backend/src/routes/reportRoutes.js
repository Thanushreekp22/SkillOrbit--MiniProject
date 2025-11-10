import express from "express";
import {
  generateReportData,
  downloadReport,
  downloadReportPDF,
  emailReport
} from "../controllers/reportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Report routes
router.get("/generate", generateReportData);     // GET /api/reports/generate
router.get("/download", downloadReport);         // GET /api/reports/download (JSON)
router.get("/download-pdf", downloadReportPDF);  // GET /api/reports/download-pdf (PDF)
router.post("/email", emailReport);              // POST /api/reports/email

export default router;
