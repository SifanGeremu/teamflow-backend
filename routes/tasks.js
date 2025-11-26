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
const queries = fs
  .readFileSync(path.join(__dirname, "../queries/tasks.sql"), "utf8")
  .split(";")
  .filter((q) => q.trim())
  .map((q) => q.trim());

const [createTaskQuery, listTasksQuery, updateTaskQuery, deleteTaskQuery] =
  queries;

// CREATE TASK
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      team_id,
      title,
      description = "",
      status = "TODO",
      due_date,
    } = req.body;
    const userId = req.user.id;

    if (!team_id || !title)
      return res.status(400).json({ error: "team_id and title required" });

    const taskId = uuidv4();
    await pool.query(createTaskQuery, [
      taskId,
      team_id,
      title,
      description,
      status,
      due_date || null,
    ]);

    const [newTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      taskId,
    ]);

    // REAL-TIME BROADCAST
    io.to(team_id).emit("task_created", newTask[0]);

    res.status(201).json(newTask[0]);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// LIST TASKS IN TEAM
router.get("/team/:team_id", requireAuth, async (req, res) => {
  try {
    const { team_id } = req.params;
    const [rows] = await pool.query(listTasksQuery, [team_id]);
    res.json({ tasks: rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// UPDATE TASK
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    const [task] = await pool.query("SELECT team_id FROM tasks WHERE id = ?", [
      id,
    ]);
    if (task.length === 0)
      return res.status(404).json({ error: "Task not found" });

    const team_id = task[0].team_id;

    // Build dynamic update query
    const fields = Object.keys(updates).filter((k) =>
      ["title", "description", "status", "due_date"].includes(k)
    );
    if (fields.length === 0)
      return res.status(400).json({ error: "No updates" });

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => updates[f]);
    values.push(id);

    await pool.query(`UPDATE tasks SET ${setClause} WHERE id = ?`, values);

    const [updated] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);

    // REAL-TIME
    io.to(team_id).emit("task_updated", updated[0]);

    res.json(updated[0]);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE TASK
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const [task] = await pool.query("SELECT team_id FROM tasks WHERE id = ?", [
      id,
    ]);
    if (task.length === 0)
      return res.status(404).json({ error: "Task not found" });

    await pool.query(deleteTaskQuery, [id]);

    // REAL-TIME
    io.to(task[0].team_id).emit("task_deleted", { id });

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
