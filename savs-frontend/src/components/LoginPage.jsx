import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // default role
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
  
      if (formData.role === 'superadmin') {
        endpoint = '/api/superadmin/login';
      } else {
        endpoint = '/api/login';
      }
  
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      alert(res.data.message);
  
      const user = res.data.user;
      
      localStorage.setItem("userData", JSON.stringify(user));
console.log("Stored user:", user);

if (user.role === 'superadmin') {
  navigate('/super-admin-panel');
} else if (user.role === 'admin') {
  navigate('/admin/dashboard');
} else if (user.role === 'student') {
  localStorage.setItem("studentLoggedIn", true);
  localStorage.setItem("studentName", user.name);
  localStorage.setItem("studentEmail", user.email);
  navigate('/student/dashboard');
}
  
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Shows specific server message
      } else {
        alert("Server error. Please try again later.");
      }
    }
  };
  

  

  const handleSignupRedirect = () => {
    // Only redirect for student and admin
    if (formData.role === 'admin') {
      navigate('/signup/admin');
    } else if (formData.role === 'student') {
      navigate('/signup/student');
    }
  };

  return (
    <div className="signup-background">
      <div className="admin-signup-box shadow">
        <h2 className="title">SMART ATTENDANCE VERIFICATION SYSTEM</h2>
        <p className="subline">Smart Attendance, Smarter Learning</p>
        <h4 className="text-center mb-4 admin-label">Login</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Login As</label>
            <select
              className="form-control"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        {formData.role !== 'superadmin' && (
          <div className="text-center mt-3">
            <p>
              New User?{" "}
              <button
                className="btn btn-link p-0"
                onClick={handleSignupRedirect}
              >
                Sign up here
              </button>
            </p>
          </div>
        )}

        {formData.role === 'superadmin' && (
          <div className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
            <em>Super Admin signup is not available. Please contact system administrator.</em>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
