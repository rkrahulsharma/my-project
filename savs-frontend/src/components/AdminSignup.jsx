import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminSignup.css';

const AdminSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    college: '',
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('college', formData.college);

    if (formData.profilePhoto) {
      formDataToSend.append('profilePhoto', formData.profilePhoto);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup/admin", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      navigate('/login'); // Redirect after successful signup
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred during registration");
      }
    }
  };

  return (
    <div className="signup-background">
      <div className="admin-signup-box shadow">
        <h2 className="title">SMART ATTENDANCE VERIFICATION SYSTEM</h2>
        <p className="subline">Smart Attendance, Smarter Learning</p>
        <h4 className="text-center mb-4 admin-label">Admin Signup</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Department</label>
            <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>College</label>
            <input type="text" className="form-control" name="college" value={formData.college} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Profile Photo</label>
            <input type="file" className="form-control" name="profilePhoto" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;