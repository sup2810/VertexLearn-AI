
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

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  "https://vertex-learn-ai-tau.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an origin (Postman/server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Allow only approved frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked CORS origin:", origin);
    return callback(null, false);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

// Apply CORS before all routes
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options(/.*/, cors(corsOptions));

// ==========================================
// 2. BODY PARSERS
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================================
// 3. HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "VertexLearnAI API is running",
  });
});

// ==========================================
// 4. API ROUTES
// ==========================================

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/features", featuresRouter);

// ==========================================
// 5. GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Global error:", err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ==========================================
// 6. START SERVER
// ==========================================

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
