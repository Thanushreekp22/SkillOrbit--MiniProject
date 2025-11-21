import express from "express";
import cors from "cors";

// ✅ Create Express app FIRST
const app = express();

// ✅ Middleware setup - CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://skill-orbit-mini-project.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Import routes AFTER app is created
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import roleSkillRoutes from "./routes/roleSkillRoutes.js";
import questionBankRoutes from "./routes/questionBankRoutes.js";
import questionnaireRoutes from "./routes/questionnaireRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import learningPathRoutes from "./routes/learningPathRoutes.js";
import trendingRoutes from "./routes/trendingRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";

// ✅ Attach routes
app.use("/api/test", testRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/roles", roleSkillRoutes);
app.use("/api/question-bank", questionBankRoutes);
app.use("/api/questionnaire", questionnaireRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/learning-path", learningPathRoutes);
app.use("/api/trending", trendingRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// ✅ Default base route
app.get("/", (req, res) => res.send("Skill Matrix Backend running 🚀"));

export default app;
