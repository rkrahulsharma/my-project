const sendEmail = require('../utils/emailService');
const express = require('express');
const router = express.Router();
const db = require('../db');

// LOGIN
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const sql = `SELECT * FROM admins WHERE email = ? AND password = ?`;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    if (user.role !== role) {
      return res.status(403).json({ message: "Role mismatch" });
    }

    if (!user.is_approved) {
      return res.status(403).json({ message: `${role} not approved yet` });
    }

    return res.status(200).json({ message: "Login successful", user });
  });
});

// SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password, department, college, role } = req.body;

  const sql = `
    INSERT INTO admins (name, email, password, department, college, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, password, department, college, role], (err, result) => {
    if (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Error occurred during registration" });
    }

    res.status(201).json({ message: "Signup successful, awaiting approval" });
  });
});

// Get Super Admin Profile
router.get('/profile', (req, res) => {
  const superAdminEmail = 'rahul.superadmin@college.edu'; // Ideally get from token/session

  const sql = `SELECT name, email, profile_photo AS profilePhoto FROM admins WHERE email = ? AND role = 'superadmin'`;

  db.query(sql, [superAdminEmail], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    return res.status(200).json(results[0]);
  });
});

// Get all admins (approved and pending)
router.get('/admins', (req, res) => {
  const sql = `SELECT id, name, email, department, college, role, is_approved FROM admins WHERE role = 'admin'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.status(200).json(results);
  });
});

// ✅ Get only pending admins
router.get('/pending-admins', (req, res) => {
  const sql = `SELECT id, name, email, department, college FROM admins WHERE role = 'admin' AND is_approved = 0`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching pending admins:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.status(200).json(results);
  });
});
// ✅ Get only pending students
router.get('/pending-students', (req, res) => {
  const sql = `SELECT * FROM students WHERE is_approved = 0 AND status = 'pending'`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching pending students:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.status(200).json(results);
  });
});

// Approve admin
router.put('/admins/:id/approve', (req, res) => {
  const { id } = req.params;
  const sqlUpdate = `UPDATE admins SET is_approved = 1 WHERE id = ?`;
  const sqlGet = `SELECT name, email FROM admins WHERE id = ?`;

  db.query(sqlUpdate, [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });

    db.query(sqlGet, [id], (err, results) => {
      if (!err && results.length > 0) {
        const { name, email } = results[0];
        sendEmail(
          email,
          "Smart Attendance - Admin Approved",
          `Hello ${name},\n\nYour admin request has been approved. You can now log in.\n\n- Team Smart Attendance`
        );
      }
    });

    res.status(200).json({ message: "Admin approved" });
  });
});

// Reject (delete) admin
router.delete('/admins/:id', (req, res) => {
  const { id } = req.params;
  const sqlGet = `SELECT name, email FROM admins WHERE id = ?`;
  const sqlDelete = `DELETE FROM admins WHERE id = ?`;

  db.query(sqlGet, [id], (err, results) => {
    if (!err && results.length > 0) {
      const { name, email } = results[0];
      sendEmail(
        email,
        "Smart Attendance - Admin Rejected",
        `Hello ${name},\n\nWe're sorry to inform you that your admin request was rejected.\n\n- Team Smart Attendance`
      );
    }
  });

  db.query(sqlDelete, [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(200).json({ message: "Admin rejected and deleted" });
  });
});

// Approve student
router.put('/students/:id/approve', (req, res) => {
  const { id } = req.params;
  const sqlUpdate = `UPDATE students SET is_approved = 1 WHERE id = ?`;
  const sqlGet = `SELECT name, email FROM students WHERE id = ?`;

  db.query(sqlUpdate, [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });

    db.query(sqlGet, [id], (err, results) => {
      if (!err && results.length > 0) {
        const { name, email } = results[0];
        sendEmail(
          email,
          "Smart Attendance - Student Approved",
          `Hello ${name},\n\nYour student account has been approved. You may now participate in sessions.\n\n- Team Smart Attendance`
        );
      }
    });

    res.status(200).json({ message: "Student approved" });
  });
});

// Reject (delete) student
router.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const sqlGet = `SELECT name, email FROM students WHERE id = ?`;
  const sqlDelete = `DELETE FROM students WHERE id = ?`;

  db.query(sqlGet, [id], (err, results) => {
    if (!err && results.length > 0) {
      const { name, email } = results[0];
      sendEmail(
        email,
        "Smart Attendance - Student Rejected",
        `Hello ${name},\n\nYour student registration has been rejected by the Super Admin.\n\n- Team Smart Attendance`
      );
    }
  });

  db.query(sqlDelete, [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(200).json({ message: "Student rejected and deleted" });
  });
});






module.exports = router;