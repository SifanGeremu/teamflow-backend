import express from "express";
import pool from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Load auth queries
const authQueries = fs
  .readFileSync(path.join(__dirname, "../queries/auth.sql"), "utf8")
  .split(";")
  .filter((q) => q.trim());

const [registerQuery, loginQuery] = authQueries.map((q) => q.trim());
// REGISTER endpoint
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Check if user exists
    const [rows] = await pool.query(loginQuery, [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Generate ID + hash password
    const id = uuidv4();
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    await pool.query(registerQuery, [id, full_name, email, password_hash]);

    res.status(201).json({ id, full_name, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// LOGIN endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [rows] = await pool.query(loginQuery, [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
export default router;