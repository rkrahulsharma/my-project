const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage: storage });

router.post("/", upload.single("facePhoto"), (req, res) => {
  const {
    name,
    email,
    password,
    mobile,
    guardianName,
    guardianEmail,
    college,
    department,
  } = req.body;
  const facePhoto = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO students 
    (name, email, password, mobile, guardian_name, guardian_email, face_photo, college, department, is_approved) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)
  `;

  db.query(sql, [name, email, password, mobile, guardianName, guardianEmail, facePhoto, college, department], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ message: "Error occurred during registration" });
    }
    res.status(200).json({
      message: "Signup successful! Awaiting admin approval (same department & college).",
    });
  });
});

module.exports = router;
