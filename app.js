// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import requireAuth from "./middleware/auth.js";

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
// Mount auth routes
app.use('/api/auth', authRouter);

// Test protected route
app.get('/api/test', requireAuth, (req, res) => {
  res.json({ 
    message: 'You are logged in!', 
    user: { id: req.user.id, email: req.user.email } 
  });
});

export default app;
