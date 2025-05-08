require('dotenv').config({ path: '.env' });
const express = require('express');  // This was missing
const cors = require("cors");
const bodyParser = require("body-parser");
const { pool, getConnection } = require("./db");

// Routes
const superAdminRoutes = require("./routes/superadmin");
const studentSignup = require("./routes/studentSignup");
const adminSignup = require("./routes/adminSignup");
const adminRoutes = require('./routes/admin');
const loginRouter = require('./routes/login');
const studentRoutes = require("./routes/student");
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = 5000;
// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/signup/student", studentSignup);
app.use("/api/signup/admin", adminSignup);
app.use('/api/admin', adminRoutes);
app.use('/api/login', loginRouter);
app.use("/api/students", studentRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Database connection
pool.getConnection()
  .then(conn => {
    console.log("✅ Connected to MySQL");
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL connection failed:", err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});