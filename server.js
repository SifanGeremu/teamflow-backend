// server.js
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import pool from "./db/db.js"; // Test DB

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io 
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.emit("welcome", { message: "wellcome to teamflow a notion,jira and trello app alltogether" });
});

// Start server
server.listen(PORT, () => {
  console.log(`TeamFlow Backend Running on http://localhost:${PORT}`);
});
