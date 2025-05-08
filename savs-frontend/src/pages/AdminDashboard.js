import React, { useState, useEffect, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';
import { ChartJS, Bar, Line } from '../utils/chartConfig'; // Move chart config to separate file
import './AdminDashboard.css';

const SessionStartForm = () => {
  const { startSession } = useContext(SessionContext);
  const [formData, setFormData] = useState({
    title: '',
    adminName: localStorage.getItem('adminName') || '',
    intervals: ['5', '10', '15'] // Default intervals in minutes
  });
  const navigate = useNavigate();

  const handleStartSession = async () => {
    try {
      const sessionData = {
        title: formData.title,
        admin_name: formData.adminName,
        intervals: formData.intervals.map(Number)
      };
      
      const response = await axios.post('http://localhost:5000/api/sessions', sessionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const newSession = {
          ...sessionData,
          id: response.data.sessionId,
          code: response.data.sessionCode
        };
        await startSession(newSession);
        navigate('/admin/host-session', { 
          state: { 
            sessionId: response.data.sessionId,
            sessionCode: response.data.sessionCode
          }
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Failed to start session';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleInputChange = (e, field) => {
    setFormData({...formData, [field]: e.target.value});
  };

  const handleIntervalChange = (e, index) => {
    const newIntervals = [...formData.intervals];
    newIntervals[index] = e.target.value;
    setFormData({...formData, intervals: newIntervals});
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <label className="form-label">Session Title</label>
        <input
          type="text"
          className="form-control"
          value={formData.title}
          onChange={(e) => handleInputChange(e, 'title')}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Admin Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.adminName}
          onChange={(e) => handleInputChange(e, 'adminName')}
          required
        />
      </div>

      <h5>Set 3 Snapshot Intervals (in minutes)</h5>
      {formData.intervals.map((val, i) => (
        <div key={i} className="mb-2">
          <input
            type="number"
            className="form-control"
            value={val}
            onChange={(e) => handleIntervalChange(e, i)}
            min="1"
            required
          />
        </div>
      ))}
      
      <Button 
        variant="primary" 
        className="mt-3"
        onClick={handleStartSession}
      >
        Start Session
      </Button>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    students: [],
    pending: [],
    sessionHistory: [],
    performanceData: []
  });
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const userData = JSON.parse(localStorage.getItem('userData'));
    setAdmin(userData);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, pendingRes, historyRes, performanceRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/students'),
        axios.get('http://localhost:5000/api/admin/pending-approvals'),
        axios.get('http://localhost:5000/api/session/history'),
        axios.get('http://localhost:5000/api/session/performance')
      ]);

      setDashboardData({
        students: studentsRes.data.students || [],
        pending: pendingRes.data.pending || [],
        sessionHistory: historyRes.data.sessions || [],
        performanceData: performanceRes.data.performance || []
      });
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    }
  };

  const approveStudent = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/approve/${id}`);
      alert('Student approved!');
      fetchDashboardData();
    } catch (err) {
      alert('Approval failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const renderStudentsList = (students) => (
    <ul className="list-group">
      {students.map((student) => (
        <li key={student.id} className="list-group-item">
          {student.name} - {student.email}
        </li>
      ))}
    </ul>
  );

  const renderPendingApprovals = (pending) => (
    pending.length === 0 ? (
      <p>No pending students</p>
    ) : (
      <ul className="list-group">
        {pending.map((student) => (
          <li
            key={student.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {student.name} - {student.email}
            <Button size="sm" onClick={() => approveStudent(student.id)}>
              Approve
            </Button>
          </li>
        ))}
      </ul>
    )
  );

  const renderSessionHistory = (sessions) => (
    sessions.length === 0 ? (
      <p>No sessions hosted yet.</p>
    ) : (
      <ul className="list-group">
        {sessions.map((session) => (
          <li key={session.id} className="list-group-item">
            <strong>{session.title}</strong> - Code: {session.code} <br />
            Created on: {new Date(session.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    )
  );

  const renderPerformanceCharts = (performanceData) => {
    const chartLabels = performanceData.map((session) => session.title || session.code);
    const chartValues = performanceData.map((session) => session.attendees);

    return (
      <>
        <h5>Student Attendance Per Session</h5>
        <Bar
          data={{
            labels: chartLabels,
            datasets: [{
              label: 'No. of Students Joined',
              data: chartValues,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />

        <h5 className="mt-4">Attendance Trend</h5>
        <Line
          data={{
            labels: chartLabels,
            datasets: [{
              label: 'Student Join Trend',
              data: chartValues,
              fill: false,
              borderColor: 'rgba(153, 102, 255, 0.8)',
              tension: 0.2,
            }],
          }}
          options={{ responsive: true }}
        />
      </>
    );
  };

  return (
    <Container className="mt-4 admin-dashboard-bg">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Welcome, {admin.name}</h3>
          <p className="text-muted">Email: {admin.email}</p>
        </div>
        <Button variant="outline-danger" onClick={logout}>
          Logout
        </Button>
      </div>

      <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
        <TabList>
          <Tab>Start Session</Tab>
          <Tab>Approve Students</Tab>
          <Tab>Session History</Tab>
          <Tab>Performance Analytics</Tab>
        </TabList>

        <TabPanel>
          <SessionStartForm />
          <h5 className="mt-4">Registered Students</h5>
          {renderStudentsList(dashboardData.students)}
        </TabPanel>

        <TabPanel>
          {renderPendingApprovals(dashboardData.pending)}
        </TabPanel>

        <TabPanel>
          {renderSessionHistory(dashboardData.sessionHistory)}
        </TabPanel>

        <TabPanel>
          {dashboardData.performanceData.length === 0 ? (
            <p>No session performance data available.</p>
          ) : (
            renderPerformanceCharts(dashboardData.performanceData)
          )}
        </TabPanel>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;