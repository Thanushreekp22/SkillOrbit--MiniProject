import express from "express";
import { getTrendingData, getDomainInsights } from "../controllers/trendingController.js";

const router = express.Router();

// Public routes - no authentication required for landing page
router.get("/", getTrendingData);                    // GET /api/trending
router.get("/domain/:domain", getDomainInsights);    // GET /api/trending/domain/:domain

export default router;
