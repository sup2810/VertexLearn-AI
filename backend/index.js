
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDB.js";

import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./route/paymentRoute.js";
import reviewRouter from "./route/reviewRoute.js";
import aiRouter from "./route/aiRoute.js";
import featuresRouter from "./route/featuresRoute.js";

const port = process.env.PORT || 4000;
const app = express();

// 1. CORS configuration
const allowedOrigins = [
  "https://vertex-learn-70ka86uuf-supritha-internship-projects.vercel.app",
  "https://vertex-learn-mts5pxmcv-supritha-internship-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);
    return callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

// CORS must come before routes
app.use(cors(corsOptions));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "VertexLearnAI API is running"
  });
});

// 4. API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/features", featuresRouter);

// 5. Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack || err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// 6. Connect database and start server ONCE
const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, "0.0.0.0", () => {
      console.log(`VertexLearnAI running on port ${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();
