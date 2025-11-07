// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "TeamFlow API v1",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

export default app;
