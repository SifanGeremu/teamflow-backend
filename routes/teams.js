import express from "express";
import pool from "../db/db.js";
import requireAuth from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { io } from "../server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Load queries
const teamsQueries = fs
  .readFileSync(path.join(__dirname, "../queries/teams.sql"), "utf8")
  .split(";")
  .filter((q) => q.trim());

const teamMembersQueries = fs
  .readFileSync(path.join(__dirname, "../queries/team-members.sql"), "utf8")
  .split(";")
  .filter((q) => q.trim());

const [createTeamQuery, listMyTeamsQuery] = teamsQueries.map((q) => q.trim());
const [addMemberQuery] = teamMembersQueries.map((q) => q.trim());

// CREATE TEAM
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Team name is required" });
    }

    const teamId = uuidv4();

    await pool.query(createTeamQuery, [teamId, name.trim(), userId]);

    const memberId = uuidv4();
    await pool.query(addMemberQuery, [memberId, teamId, userId, "ADMIN"]);

    res.status(201).json({
      message: "Team created successfully",
      team: { id: teamId, name: name.trim() },
    });
  } catch (error) {
    console.error("Create team error:", error);
    res.status(500).json({ error: "Failed to create team" });
  }
});

// LIST MY TEAMS
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(listMyTeamsQuery, [userId]);
    res.json({ teams: rows });
  } catch (error) {
    console.error("List teams error:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// JOIN TEAM BY ID
router.post("/:id/join", requireAuth, async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const userId = req.user.id;

    // Check if team exists
    const [teamRows] = await pool.query("SELECT id FROM teams WHERE id = ?", [
      teamId,
    ]);
    if (teamRows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if already a member
    const [memberRows] = await pool.query(
      "SELECT id FROM team_members WHERE team_id = ? AND user_id = ?",
      [teamId, userId]
    );
    if (memberRows.length > 0) {
      return res.status(400).json({ error: "Already a member" });
    }

    // Add as MEMBER
    const memberId = uuidv4();
    await pool.query(addMemberQuery, [memberId, teamId, userId, "MEMBER"]);

    // REAL-TIME: Notify everyone in the team
    io.to(teamId).emit("member_joined", {
      teamId,
      member: {
        user_id: userId,
        full_name: req.user.full_name || "New Member",
        role: "MEMBER",
      },
    });

    res.json({ message: "Joined team successfully" });
  } catch (error) {
    console.error("Join team error:", error);
    res.status(500).json({ error: "Failed to join team" });
  }
});

export default router;
