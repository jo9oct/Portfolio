import sendMessage from "../controller/telegram.controller.js";
import { Router } from "express";   

const router = Router();

router.post("/send", sendMessage);

export default router;