import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import bg from '../assets/bg.png';
import gif from '../assets/down-arrow.gif';
import { useNavigate } from 'react-router-dom';

const quotes = [
  { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The purpose of education is to replace an empty mind with an open one.", author: "Malcolm Forbes" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" }
];

const LandingPage = () => {
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  const handleGo = () => {
    if (role === 'student') {
      navigate('/student-login');
    } else if (role === 'admin') {
      navigate('/admin-login');
    } else {
      alert('Please select a role');
    }
  };

  return (
    <div className="landing-page">
      <div className="left-quote">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>

      <div className="content-box">
        <div className="project-title">SMART ATTENDANCE VERIFICATION SYSTEM</div>
        <div className="sub-line">SMART ATTENDANCE, SMARTER LEARNING</div>
        <img src={gif} alt="Down Arrow" className="gif-image" />

        <div className="role-section">WHO IS THERE?</div>

        <div>
          <label>
            <input
              type="radio"
              value="student"
              checked={role === 'student'}
              onChange={(e) => setRole(e.target.value)}
            />
            Student
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>

        <button className="go-button" onClick={handleGo}>
          Go
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
