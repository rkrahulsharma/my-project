const express = require('express');
const router = express.Router();
const db = require('../config/database');
const faceRecognition = require('../services/faceRecognition');
const { authenticateStudent } = require('../middleware/auth');

// POST /api/attendance/capture - Handle image capture and face matching
router.post('/capture', authenticateStudent, async (req, res) => {
  try {
    const { sessionId, imageData } = req.body;
    const studentId = req.user.id;

    // 1. Get student's registered face data
    const [student] = await db.query(
      `SELECT face_data FROM students WHERE id = ?`,
      [studentId]
    );

    if (!student.length) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // 2. Perform face matching
    const matchResult = await faceRecognition.compareFaces(
      imageData, 
      student[0].face_data
    );

    // 3. Record attendance
    await db.query(
      `INSERT INTO session_attendance 
      (session_id, student_id, image_path, is_verified, match_score) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        sessionId,
        studentId,
        saveImageToDisk(imageData), // Implement this function
        matchResult.verified,
        matchResult.score
      ]
    );

    res.json({
      success: true,
      verified: matchResult.verified,
      score: matchResult.score
    });
  } catch (err) {
    console.error('Attendance capture error:', err);
    res.status(500).json({
      success: false,
      message: 'Attendance capture failed'
    });
  }
});

module.exports = router;