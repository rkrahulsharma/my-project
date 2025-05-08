// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // optional for styling

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/">SAVS</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/history">Session History</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/performance">Performance Chart</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;