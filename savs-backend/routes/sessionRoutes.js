const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure the db module is correctly imported

// POST /api/session/start
router.post('/start', async (req, res) => {
  const { title, code, adminName, intervals } = req.body;

  if (!title || !code || !adminName || !intervals || intervals.length < 3) {
    return res.status(400).json({ message: 'Missing required session data.' });
  }

  try {
    await db.query(
      'INSERT INTO sessions (title, code, admin_name, intervals, is_active, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, code, adminName, JSON.stringify(intervals), true]
    );

    res.json({ message: 'Session started successfully.' });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Failed to start session.' });
  }
});

// GET /api/session/history
router.get('/history', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sessions ORDER BY created_at DESC');
    const rows = result[0]; // FIX HERE
    res.json({ sessions: rows });
  } catch (error) {
    console.error('Error fetching session history:', error);
    res.status(500).json({ message: 'Failed to fetch session history.' });
  }
});


/// GET /api/session/performance
router.get('/performance', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.id, s.title, s.code, s.created_at, 
        COUNT(sa.id) AS attendees 
      FROM sessions s
      LEFT JOIN session_attendance sa ON s.id = sa.session_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT 5
    `);

    const rows = result[0]; // Ensure this is an array

    if (Array.isArray(rows)) {
      res.json({ performance: rows.reverse() });
    } else {
      console.error('Expected an array of rows but got:', rows);
      res.status(500).json({ message: 'Unexpected data format for performance data' });
    }

  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
});
// GET /api/admin/pending-approvals
router.get('/pending-approvals', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students WHERE is_approved = 0');
    res.json({ pending: rows });
  } catch (err) {
    console.error('Error fetching pending approvals:', err);
    res.status(500).json({ message: 'Failed to fetch pending approvals' });
  }
});


module.exports = router;
