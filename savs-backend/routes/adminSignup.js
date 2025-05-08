// Inside C:\Users\Welcome\OneDrive\Desktop\SAVS\savs-backend\routes\adminSignup.js
const express = require('express');
const multer = require('multer');
const db = require('../db');
const path = require('path');

const router = express.Router();

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save the uploaded files inside the 'uploads' folder
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Use a timestamp as the file name to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

// Admin Signup Route with profile photo handling
router.post("/", upload.single('profilePhoto'), (req, res) => {
  const { name, email, password, department, college } = req.body;
  const profilePhoto = req.file ? req.file.path : null; // Handle the file path if uploaded

  // Validate inputs
  if (!name || !email || !password || !department || !college) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if the admin already exists in the database
  const checkSql = "SELECT * FROM admins WHERE email = ?";
  db.query(checkSql, [email], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Check Error:", checkErr);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ message: "Admin already registered with this email." });
    }

    // Insert the new admin into the database
    const insertSql = `
      INSERT INTO admins 
      (name, email, password, department, college, is_approved, profile_photo) 
      VALUES (?, ?, ?, ?, ?, FALSE, ?)
    `;

    db.query(insertSql, [name, email, password, department, college, profilePhoto], (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.status(500).json({ message: "Error occurred during registration" });
      }

      res.status(200).json({
        message: "Admin signup successful! Awaiting Super Admin approval.",
      });
    });
  });
});

module.exports = router;
