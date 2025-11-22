import express from "express";
import {
  generateReportData,
  downloadReport,
  downloadReportPDF,
  emailReport
} from "../controllers/reportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Email configuration check (public endpoint for debugging)
router.get("/email-status", (req, res) => {
  const emailConfigured = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
  res.json({
    configured: emailConfigured,
    host: process.env.EMAIL_HOST || 'Not set',
    user: process.env.EMAIL_USER || 'Not set',
    port: process.env.EMAIL_PORT || 'Not set',
    message: emailConfigured 
      ? 'Email service is configured and ready' 
      : 'Email service is NOT configured. Add EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.'
  });
});

// All routes require authentication
router.use(verifyToken);

// Report routes
router.get("/generate", generateReportData);     // GET /api/reports/generate
router.get("/download", downloadReport);         // GET /api/reports/download (JSON)
router.get("/download-pdf", downloadReportPDF);  // GET /api/reports/download-pdf (PDF)
router.post("/email", emailReport);              // POST /api/reports/email

export default router;
