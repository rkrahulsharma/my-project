const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateAdmin = (req, res, next) => next(); // Bypass auth for testing

// POST /api/sessions - Create new session
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, admin_name, intervals } = req.body;
    
    // Validate inputs
    if (!title || !admin_name || !intervals || intervals.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Title, admin name and 3 intervals are required'
      });
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const [result] = await pool.query(
      `INSERT INTO sessions 
      (title, code, admin_name, intervals, is_active) 
      VALUES (?, ?, ?, ?, 1)`,
      [title, code, admin_name, JSON.stringify(intervals)]
    );

    res.status(201).json({
      success: true,
      sessionId: result.insertId,
      sessionCode: code,
      message: 'Session created successfully'
    });
  } catch (err) {
    console.error('Session creation error:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Session with this code already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create session. Please try again.'
    });
  }
});

// ... rest of your sessionRoutes.js code remains the same ...
// GET /api/sessions/:id - Get session details
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const [session] = await pool.query(
      `SELECT s.*, 
      COUNT(sa.student_id) as participants,
      SUM(sa.is_verified) as verified_attendance
      FROM sessions s
      LEFT JOIN session_attendance sa ON s.id = sa.session_id
      WHERE s.id = ?`,
      [req.params.id]
    );

    if (!session.length) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session: {
        ...session[0],
        intervals: JSON.parse(session[0].intervals || '[]'),
        participants: session[0].participants,
        verified_attendance: session[0].verified_attendance
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// POST /api/sessions/:id/end - End session
router.post('/:id/end', authenticateAdmin, async (req, res) => {
  try {
    await pool.query(
      `UPDATE sessions SET is_active = 0 WHERE id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET /api/sessions - List all sessions
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const [sessions] = await pool.query(
      `SELECT s.*, 
      COUNT(sa.student_id) as participants
      FROM sessions s
      LEFT JOIN session_attendance sa ON s.id = sa.session_id
      GROUP BY s.id
      ORDER BY s.created_at DESC`
    );

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        ...session,
        intervals: JSON.parse(session.intervals || '[]')
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = router;