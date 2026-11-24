import { Router } from "express";
import {
  handleRegisterVisitor,
  handleGetVisitorStats,
} from "../controller/visitor.controller.js";
import { validateVisitorId } from "../middleware/visitor.validator.js";

const router = Router();

// POST /api/v1/visitors/register
router.post("/register", validateVisitorId, handleRegisterVisitor);

// GET /api/v1/visitors/stats
router.get("/stats", handleGetVisitorStats);

export default router;
