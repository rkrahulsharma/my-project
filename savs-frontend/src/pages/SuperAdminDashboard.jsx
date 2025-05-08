import React, { useState, useEffect } from 'react';
import './SuperAdminDashboard.css';
import axios from 'axios';
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminTab from '../components/AdminTab.jsx';
import StudentTabComponent from '../components/StudentTabComponent.jsx';

console.log("StudentTab:", StudentTabComponent);
const SuperAdminDashboard = () => {
  const [key, setKey] = useState('admins');
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch super admin profile
    axios.get('http://localhost:5000/api/superadmin/profile')
      .then(res => setProfile(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
    // Clear token/session if any
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h4>SAVS - Super Admin Dashboard</h4>
        <div className="profile-section">
          <img src={profile?.profilePhoto || '/default-profile.png'} alt="Profile" />
          <div>
            <p><strong>{profile.name}</strong></p>
            <p>{profile.email}</p>
            <p>Welcome, Super Admin!</p>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
          </div>
        </div>
      </div>
  
      <div className="dashboard-tabs">
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="admins" title="Admins">
            <AdminTab /> {/* Moved here */}
          </Tab>
          <Tab eventKey="students" title="Students">
  <StudentTabComponent />
  
</Tab>
          <Tab eventKey="sessions" title="Sessions">
            <div>Session History Table (next step)</div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
  
};

export default SuperAdminDashboard;