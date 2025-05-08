// routes/student.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all students
router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

module.exports = router; // ✅ Make sure this is present