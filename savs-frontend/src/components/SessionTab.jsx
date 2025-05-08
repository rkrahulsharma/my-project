import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SessionTab = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/superadmin/sessions')
      .then(res => setSessions(res.data))
      .catch(err => console.error("Error fetching sessions", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Sessions Conducted by Approved Admins</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Session ID</th>
              <th>Session Name</th>
              <th>Host Email</th>
              <th>Total Participants</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{session.id}</td>
                <td>{session.session_name}</td>
                <td>{session.host_email}</td>
                <td>{session.total_participants}</td>
                <td>{new Date(session.start_time).toLocaleString()}</td>
                <td>{new Date(session.end_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTab;
