import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login/admin', { email, password });
      setMessage(res.data.message);
      // You can redirect or store admin info here
    } catch (err) {
      setMessage(err.response.data.error || 'Login failed');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>SMART ATTENDANCE VERIFICATION SYSTEM</h2>
        <p>Smart Attendance, Smarter Learning</p>
        <h3>Admin Login</h3>
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

export default AdminLogin;
