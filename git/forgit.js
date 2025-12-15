// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import requireAuth from "./middleware/auth.js";
import teamsRouter from "./routes/teams.js";
import tasksRouter from "./routes/tasks.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/teams", teamsRouter);
app.use("/api/auth", authRouter);
app.use("/api/teams", teamsRouter);

app.use("/api/tasks", tasksRouter);
// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "TeamFlow API v1",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});
// Mount auth routes
app.use("/api/auth", authRouter);

// Test protected route
app.get("/api/test", requireAuth, (req, res) => {
  res.json({
    message: "You are logged in!",
    user: { id: req.user.id, email: req.user.email },
  });
});

export default app;
