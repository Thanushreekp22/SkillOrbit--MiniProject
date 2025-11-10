import express from "express";
import { createRole, getAllRoles } from "../controllers/roleController.js";

const router = express.Router();

router.post("/", createRole); // POST /api/roles
router.get("/", getAllRoles); // GET /api/roles

export default router;
