import express from "express";
import pool from "../db/db.js";
import requireAuth from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Load queries from teams.sql and team_members.sql
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
// POST /teams → Create a new team
// Protected route – only logged-in users
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // from JWT middleware

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Team name is required" });
    }

    const teamId = uuidv4();

    // 1. Create the team
   await pool.query(createTeamQuery, [teamId, name.trim(), userId]);

    // 2. Add creator as ADMIN
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
// GET /teams → List all teams the user belongs to
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(listMyTeamsQuery, [userId]);

    res.json({ teams: rows });
  } catch (error) {
    console.error('List teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});
export default router;
