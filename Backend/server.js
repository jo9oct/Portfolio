import express from "express";
import dotenv from "dotenv";
import router from "./src/router/telegram.route.js";
import aiRouter from "./src/router/ai.route.js";
import visitorRouter from "./src/router/visitor.route.js";
import cors from "cors";

dotenv.config();

const app=express();

const rawFrontEndUrls = process.env.Front_End_URL
  ? process.env.Front_End_URL.split(",").map((url) => url.trim().replace(/\/+$/, ""))
  : [];

const allowedOrigins = [
  ...rawFrontEndUrls,
  "http://localhost:5050",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
const PORT=process.env.PORT || 3422;

app.use("/telegram", router);
app.use("/ai", aiRouter);
app.use("/api/v1/visitors", visitorRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
});
