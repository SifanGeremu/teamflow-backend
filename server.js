// server.js
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import pool from "./db/db.js";

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io instance
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Export io so routes can use it
export { io };

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_team", (teamId) => {
    socket.join(teamId);
    console.log(`User ${socket.id} joined team room: ${teamId}`);
  });

  socket.on("member_joined", ({ teamId, member }) => {
    io.to(teamId).emit("member_joined", member);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`TeamFlow Backend Running on http://localhost:${PORT}`);
});
