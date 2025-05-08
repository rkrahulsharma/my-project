// src/components/SessionHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/session/history')
      .then(res => setSessions(res.data.sessions))
      .catch(err => console.error('Error fetching session history:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Session History</h3>
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="list-group">
          {sessions.map(session => (
            <li className="list-group-item" key={session.id}>
              <strong>{session.title}</strong><br />
              Code: {session.code} <br />
              Status: {session.is_active ? 'Active' : 'Ended'}<br />
              Created At: {new Date(session.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionHistory;