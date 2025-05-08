const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/', (req, res) => {
  const { adminId } = req.body;

  if (!adminId) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  const query = "UPDATE admins SET is_approved = TRUE WHERE id = ?";
  db.query(query, [adminId], (err, result) => {
    if (err) {
      console.error("Error approving admin:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Admin approved successfully" });
  });
});

module.exports = router;
