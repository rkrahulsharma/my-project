const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Setup Multer for storing face photo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ✅ this folder must exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 📌 Student Signup Route
router.post('/student', upload.single('photo'), (req, res) => {
  const { name, email, mobile, guardian_name, guardian_email, password } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!photo) {
    return res.status(400).json({ error: 'Photo upload failed' });
  }

  const sql = `
    INSERT INTO students (name, email, mobile, guardian_name, guardian_email, password, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, mobile, guardian_name, guardian_email, password, photo], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: '✅ Student registered successfully' });
  });
});

module.exports = router;
