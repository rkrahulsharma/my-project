const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const query = "SELECT id, name, email, department, college FROM admins WHERE is_approved = FALSE";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching pending admins:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
