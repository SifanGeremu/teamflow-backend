// db/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool
  .getConnection()
  .then((conn) => {
    console.log("MySQL Connected Successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("MySQL Connection Failed:", err.message);
    process.exit(1);
  });

export default pool;
