import React, { useState } from 'react';
import axios from 'axios';
import './StudentLogin.css';

function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login/student', { email, password });
      setMessage(res.data.message);
      // You can redirect or store student info here
    } catch (err) {
      setMessage(err.response.data.error || 'Login failed');
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-box">
        <h2>SMART ATTENDANCE VERIFICATION SYSTEM</h2>
        <p>Smart Attendance, Smarter Learning</p>
        <h3>Student Login</h3>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default StudentLogin;
