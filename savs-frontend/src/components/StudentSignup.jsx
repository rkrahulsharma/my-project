import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentSignup.css';

const StudentSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    guardianName: '',
    guardianEmail: '',
    college: '',
    department: '',
    facePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'facePhoto') {
      setFormData({ ...formData, facePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("mobile", formData.mobile);
    data.append("guardianName", formData.guardianName);
    data.append("guardianEmail", formData.guardianEmail);
    data.append("college", formData.college);
    data.append("department", formData.department);
    data.append("facePhoto", formData.facePhoto);

    try {
      const res = await axios.post("http://localhost:5000/api/signup/student", data);
      alert(res.data.message); // e.g., “Signup successful, pending approval”
      navigate('/login'); // Redirect to common login page
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-card">
        <h3 className="text-center fw-bold text-primary" style={{ fontSize: '1.3rem' }}>
          SMART ATTENDANCE<br />VERIFICATION SYSTEM
        </h3>
        <p className="text-center text-secondary mb-3" style={{ fontSize: '0.95rem' }}>
          Smart Attendance, Smarter Learning
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-2"><label>Name</label><input type="text" name="name" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-2"><label>Email</label><input type="email" name="email" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-2"><label>Password</label><input type="password" name="password" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-2"><label>Mobile</label><input type="text" name="mobile" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-2"><label>Guardian Name</label><input type="text" name="guardianName" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-2"><label>Guardian Email</label><input type="email" name="guardianEmail" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-2"><label>College</label><input type="text" name="college" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-3"><label>Department</label><input type="text" name="department" className="form-control" onChange={handleChange} required /></div>
          <div className="mb-3"><label>Upload Face Photo</label><input type="file" name="facePhoto" accept="image/*" className="form-control" onChange={handleChange} required /></div>
          <div className="text-center"><button type="submit" className="btn btn-primary w-100">Sign Up</button></div>
        </form>
      </div>
    </div>
  );
};

export default StudentSignup;
