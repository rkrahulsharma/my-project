const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const activeRooms = new Set(); // Keeps track of active rooms

const db = require("./db");
const superAdminRoutes = require("./routes/superadmin");
const studentSignup = require("./routes/studentSignup");
const adminSignup = require("./routes/adminSignup");
const adminRoutes = require('./routes/admin');
const loginRouter = require('./routes/login');
const studentRoutes = require("./routes/student");

const sessionRoutes = require('./routes/sessionRoutes'); // ✅ correct
const app = express();
const PORT = 5000;

// Create HTTP server & attach Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST"]
  }
});

// WebSocket / WebRTC Signaling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Admin joins the room
  socket.on('admin-join', ({ roomId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.role = 'admin';
    console.log(`Admin joined room: ${roomId}`);
  });

  // Student joins the room
  socket.on('join-session', ({ roomId, name }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.role = 'student';
    console.log(`${name} joined room: ${roomId}`);

    // Notify admin that a new student has joined
    socket.to(roomId).emit('student-joined', { name, socketId: socket.id });
  });

  // Handle WebRTC signaling
  socket.on('signal', ({ target, signal }) => {
    io.to(target).emit('signal', { signal, sender: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (e.g. uploaded images)
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/signup/student", studentSignup);
app.use("/api/signup/admin", adminSignup);
app.use('/api/admin', adminRoutes);
app.use('/api/login', loginRouter);
app.use("/api/students", studentRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use('/api/session', sessionRoutes);

// MySQL connection test
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
    connection.release();
  }
});

// Start server with WebSocket support
server.listen(PORT, () => {
  console.log(`🚀 Server + WebSocket running at http://localhost:${PORT}`);
});
