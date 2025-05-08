const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'savsb05@gmail.com',
    pass: 'dply ggmy kgqi ureu'
  }
});

const sendEmail = async (to, subject, bodyText) => {
  const mailOptions = {
    from: '"SAVS Team" <savsb05@gmail.com>',
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${subject}</h2>
        <p>${bodyText.replace(/\n/g, '<br>')}</p>
        <hr />
        <p style="font-size: 12px; color: #888;">Smart Attendance Verification System (SAVS)</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

module.exports = sendEmail;