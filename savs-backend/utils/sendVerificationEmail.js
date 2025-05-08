const nodemailer = require('nodemailer');

// create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rksharmaa003@@gmail.com',        // ✅ replace with your email
    pass: 'Rahul@241206',           // ✅ replace with your app password
  },
});

const sendVerificationEmail = async (to, name, role) => {
  const mailOptions = {
    from: '"SAVS System" <rksharmaa003@gmail.com>',  // ✅ match your sender email
    to: to,
    subject: `${role} Registration Confirmation`,
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering as a <strong>${role}</strong> on the Smart Attendance Verification System (SAVS).</p>
      <p>We're glad to have you on board!</p>
      <hr/>
      <small>Note: This is an auto-generated email. Please do not reply.</small>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
