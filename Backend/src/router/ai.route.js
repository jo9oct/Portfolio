import askPortfolioAI from "../controller/ai.controller.js";
import { Router } from "express";   

const router = Router();

router.post("/send", askPortfolioAI);

export default router;