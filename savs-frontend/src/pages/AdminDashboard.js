import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tab, Tabs, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchPending();
    fetchSessionHistory();
    fetchPerformance();
    const userData = JSON.parse(localStorage.getItem('userData'));
    setAdmin(userData);
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/students');
      setStudents(res.data.students);
    } catch (err) {
      alert('Failed to fetch students');
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-approvals');
      setPending(res.data.pending || []);
    } catch (err) {
      console.error('Error fetching pending approvals', err);
    }
  };

  const fetchSessionHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/session/history');
      setSessionHistory(res.data.sessions || []);
    } catch (err) {
      alert('Failed to fetch session history');
    }
  };

  const fetchPerformance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/session/performance');
      setPerformanceData(res.data.performance || []);
    } catch (err) {
      alert('Failed to load performance data');
    }
  };

  const approveStudent = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/approve/${id}`);
      alert('Student approved!');
      fetchPending();
      fetchStudents();
    } catch (err) {
      alert('Approval failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    window.location.href = '/';
  };

  const chartLabels = performanceData.map((session) => session.title || session.code);
  const chartValues = performanceData.map((session) => session.attendees);

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

      <Tabs defaultActiveKey="host" className="mb-3" fill>
        {/* Host Session */}
        <Tab eventKey="host" title="📡 Host Session">
          <div className="mb-3">
            <Button onClick={() => navigate('/admin/host-session')}>
              Go to Host Session
            </Button>
          </div>
          <h5>Registered Students</h5>
          <ul className="list-group">
            {students.map((student) => (
              <li key={student.id} className="list-group-item">
                {student.name} - {student.email}
              </li>
            ))}
          </ul>
        </Tab>

        {/* Pending Approvals */}
        <Tab eventKey="pending" title="🕓 Pending Approvals">
          {pending.length === 0 ? (
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
          )}
        </Tab>

        {/* Session History */}
        <Tab eventKey="history" title="📁 Session History">
          {sessionHistory.length === 0 ? (
            <p>No sessions hosted yet.</p>
          ) : (
            <ul className="list-group">
              {sessionHistory.map((session) => (
                <li key={session.id} className="list-group-item">
                  <strong>{session.title}</strong> - Code: {session.code} <br />
                  Created on: {new Date(session.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </Tab>

        {/* Performance Charts */}
        <Tab eventKey="charts" title="📊 Performance Charts">
          {performanceData.length === 0 ? (
            <p>No session performance data available.</p>
          ) : (
            <>
              <h5>Student Attendance Per Session</h5>
              <Bar
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      label: 'No. of Students Joined',
                      data: chartValues,
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />

              <h5 className="mt-4">Attendance Trend</h5>
              <Line
                data={{
                  labels: chartLabels,
                  datasets: [
                    {
                      label: 'Student Join Trend',
                      data: chartValues,
                      fill: false,
                      borderColor: 'rgba(153, 102, 255, 0.8)',
                      tension: 0.2,
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;