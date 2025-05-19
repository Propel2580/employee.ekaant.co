import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import fs from 'fs';
import employeeRouter from "./routes/employee.route.js";
import authRouter from "./routes/auth.route.js";
import activityLogRouter from "./routes/activityLog.route.js";
import expertSessionRouter from "./routes/expertSession.route.js";
import liveSessionRouter from "./routes/liveSession.route.js";
import liveSessionRoutes from './routes/liveSession.route.js';
import notificationRouter from "./routes/notification.route.js";
import programProgressRouter from "./routes/programProgress.route.js";
//import chartDataRouter from "./routes/chartData.route.js";
import insightRouter from "./routes/insight.route.js";
import challengeRouter from "./routes/challenge.route.js";
import barChartRouter from "./routes/barChart.route.js"; // Added import for bar chart routes
import lineChartRouter from "./routes/lineChart.route.js"; // Added import for line chart routes
import challengeProgressRouter from "./routes/challengeProgress.route.js"; // Added import for challenge progress routes
import programTrackerRouter from "./routes/programTracker.route.js"; // Added import for program tracker routes
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const app = express();
const __dirname = path.resolve();
let PORT = process.env.PORT || 3000;

// Configure CORS before other middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://0.0.0.0:3000', 'https://ekaant.onrender.com','https://employee-ekaant-co-9005-4d9445b1-wtjycodr.onporter.run','https://employee.ekaant.co'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Request Headers:", req.headers);
  
  // Skip body check for multipart/form-data requests
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  
  // Check JSON body for other requests
  if (req.method === "POST" && req.headers['content-type']?.includes('application/json')) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Request body is empty. Please send valid JSON data." });
    }
  }
  next();
});

// Configure CORS before other middleware (This duplicate line was removed)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://0.0.0.0:3000', 'https://ekaant.onrender.com','https://employee-ekaant-co-9005-4d9445b1-wtjycodr.onporter.run','https://employee.ekaant.co'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length']
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});


// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/employee", employeeRouter);
app.use("/api", authRouter);
app.use("/api/activity", activityLogRouter);
app.use("/api/expert-session", expertSessionRouter);
app.use("/api/book-live", liveSessionRouter);

app.use('/api/live-sessions', liveSessionRoutes);
app.use("/api/notifications", notificationRouter);
app.use("/api/program-progress", programProgressRouter);
//app.use("/api/chart-data", chartDataRouter);
app.use("/api/insights", insightRouter);
app.use("/api/challenges", challengeRouter);
app.use("/api/barchart", barChartRouter); // Added bar chart routes
app.use("/api/linechart", lineChartRouter); // Added line chart routes
app.use("/api", challengeProgressRouter); // Routes will be available at /api/challengeprogresstracking/*
app.use("/api", programTrackerRouter); // Routes will be available at /api/programtracktracking/*
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });
app.use(express.static(path.join(__dirname, '/employees/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'employees','dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error("Error: ", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    PORT++;
    console.log(`Port 3000 is in use, trying port ${PORT}...`);
    server.listen(PORT);
  } else {
    console.error("Server error:", err);
  }
});