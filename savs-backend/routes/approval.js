const express = require('express');
const router = express.Router();
const db = require('../db');

// Approve admin or student
router.post('/approve', (req, res) => {
  const { id, role, approverRole, approverCollege, approverDepartment } = req.body;

  const table = role === 'admin' ? 'admins' : 'students';

  // Admin trying to approve a student → check same college & department
  if (role === 'student' && approverRole === 'admin') {
    const checkSql = `SELECT * FROM students WHERE id = ? AND college = ? AND department = ?`;
    db.query(checkSql, [id, approverCollege, approverDepartment], (err, results) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (results.length === 0) {
        return res.status(403).json({ message: "You can only approve students from your college & department" });
      }
      approveUser(id, table, res);
    });
  } else {
    // Superadmin approving any admin/student
    approveUser(id, table, res);
  }
});

function approveUser(id, table, res) {
  const approveSql = `UPDATE ${table} SET is_approved = 1 WHERE id = ?`;
  db.query(approveSql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User approved successfully" });
  });
}

module.exports = router;
