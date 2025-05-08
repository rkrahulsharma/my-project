import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <h2>Welcome to SAVS</h2>
      <Link to="/signup/student" className="btn btn-primary mt-3">Go to Student Signup</Link>
    </div>
  );
}

export default Home;
