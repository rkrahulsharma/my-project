const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Dummy session data
const sampleSession = {
  sessionName: "AI Class - April 21",
  startTime: "2025-04-21 10:00 AM",
  endTime: "2025-04-21 11:00 AM",
  attendance: [
    { name: "Rahul", email: "rahul@email.com", status: "Present" },
    { name: "Arjun", email: "arjun@email.com", status: "Absent" },
  ]
};

router.get('/generate-pdf', (req, res) => {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, '../reports', `${Date.now()}-attendance.pdf`);

  if (!fs.existsSync(path.join(__dirname, '../reports'))) {
    fs.mkdirSync(path.join(__dirname, '../reports'));
  }

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.fontSize(20).text("Smart Attendance Verification System", { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`📘 Session: ${sampleSession.sessionName}`);
  doc.text(`⏰ Time: ${sampleSession.startTime} to ${sampleSession.endTime}`);
  doc.moveDown();

  doc.text("🧑 Attendance List:");
  doc.moveDown();

  sampleSession.attendance.forEach((entry, index) => {
    doc.text(`${index + 1}. ${entry.name} - ${entry.email} - ${entry.status}`);
  });

  doc.end();

  writeStream.on('finish', () => {
    res.download(filePath, 'Attendance_Report.pdf', () => {
      fs.unlinkSync(filePath); // delete file after download
    });
  });
});

// ✅ Don't forget this!
module.exports = router;
