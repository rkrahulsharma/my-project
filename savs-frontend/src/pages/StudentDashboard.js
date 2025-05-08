import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [activeTab, setActiveTab] = useState('join');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('studentLoggedIn');
    if (!isLoggedIn) {
      navigate('/login'); // kick out unauthenticated access
    } else {
      // Set profile info
      setStudentName(localStorage.getItem('studentName'));
      setStudentEmail(localStorage.getItem('studentEmail'));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'join':
        return (
          <div className="card p-4 shadow">
            <h4>Join Session</h4>
            <p>Click below to join a session using a session code.</p>
            <button className="btn btn-primary" onClick={() => navigate('/join-session')}>
              Go to Join Session
            </button>
          </div>
        );
      case 'sessions':
        return (
          <div className="card p-4 shadow">
            <h4>Previous Sessions</h4>
            <p>You have not attended any sessions yet.</p>
          </div>
        );
      case 'engage':
        return (
          <div className="card p-4 shadow">
            <h4>Engagement Report</h4>
            <p>Engagement analytics will appear here after attending sessions.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Welcome, {studentName}</h2>

      {/* Profile Section */}
      <div className="card p-4 shadow mb-4">
        <h4>Your Profile</h4>
        <p><strong>Name:</strong> {studentName}</p>
        <p><strong>Email:</strong> {studentEmail}</p>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
      </div>

      {/* Tab Section */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'join' ? 'active' : ''}`} onClick={() => setActiveTab('join')}>
            Join Session
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
            Sessions
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'engage' ? 'active' : ''}`} onClick={() => setActiveTab('engage')}>
            Engage
          </button>
        </li>
      </ul>

      {/* Render the Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default StudentDashboard;