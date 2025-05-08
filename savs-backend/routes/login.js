const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Login attempt:", email, role);

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let query = "";
    if (role === "admin") {
      query = "SELECT * FROM admins WHERE email = ? AND password = ?";
    } else if (role === "student") {
      query = "SELECT * FROM students WHERE email = ? AND password = ?";
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error("Login DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = { ...results[0], role };
      console.log("Sending user to frontend:", user);

      return res.status(200).json({ message: "Login successful", user });
    });

  } catch (error) {
    console.error("Login Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;