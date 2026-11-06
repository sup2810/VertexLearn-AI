
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);// ── dotenv SABSE PEHLE ───────────────────────────────────────────────────────
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDB.js";

import authRouter     from "./route/authRoute.js";
import userRouter     from "./route/userRoute.js";
import courseRouter   from "./route/courseRoute.js";
import paymentRouter  from "./route/paymentRoute.js";
import reviewRouter   from "./route/reviewRoute.js";
import aiRouter       from "./route/aiRoute.js";
import featuresRouter from "./route/featuresRoute.js";

const port = process.env.PORT || 4000;
const app  = express();

// ── 1. CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
 "https://vertex-learn-mts5pxmcv-supritha-internship-projects.vercel.app",     // production frontend
  "https://vertexlearn-ai-backend.onrender.com",  // production backend
  "http://localhost:5173",                     // local vite
  "http://localhost:3000",                     // local fallback
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods:          ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders:   ["Content-Type", "Authorization", "Cookie"],
  credentials:      true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ── 2. Body parsers ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── 3. Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRouter);
app.use("/api/user",     userRouter);
app.use("/api/course",   courseRouter);
app.use("/api/order",    paymentRouter);
app.use("/api/review",   reviewRouter);
app.use("/api/ai",       aiRouter);
app.use("/api/features", featuresRouter);

// ── 4. Health check ──────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "EduVerse API is running" });
});

// ── 5. Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global error:", err.message);
  res.status(500).json({ message: err.message || "Internal server error" });
});

// ── 6. Start + DB ────────────────────────────────────────────────────────────
app.listen(port, async () => {
  const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, () => {
      console.log(`VertexLearnAI server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
});
