const express = require('express');
const router = express.Router();
const db = require("../db");

// Route to get all students
router.get('/students', (req, res) => {
  // Replace with your actual database logic
  const dummyStudents = [
    { id: 1, name: 'Rahul', email: 'rahul@example.com' },
    { id: 2, name: 'John', email: 'john@example.com' },
  ];

  res.json({ students: dummyStudents });
});

// Example route: Get all admins
router.get("/admins", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM admins");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// Example route: End session
router.post("/start-session", (req, res) => {
  const { sessionName, hostName, adminEmail, roomId, intervals, startTime } = req.body;

const sql = `INSERT INTO sessions (session_name, host_name, admin_email, room_id, intervals, start_time) VALUES (?, ?, ?, ?, ?, ?)`;

const values = [sessionName, hostName, adminEmail, roomId, JSON.stringify(intervals), startTime];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB insert error:", err);
      return res.status(500).json({ success: false });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;