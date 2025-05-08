import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap';

function StartSessionForm() {
  const { state } = useLocation();
  const { currentSession, endSession } = useContext(SessionContext);
  const [timeLeft, setTimeLeft] = useState(null);
  const [captures, setCaptures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.sessionId) {
      navigate('/admin/dashboard');
      return;
    }

    let intervalIndex = 0;
    let countdown = currentSession?.intervals[0] * 60 || 0;
    setTimeLeft(countdown);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Trigger capture and move to next interval
          handleCapture();
          intervalIndex = (intervalIndex + 1) % currentSession.intervals.length;
          return currentSession.intervals[intervalIndex] * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession]);

  const handleCapture = async () => {
    try {
      // This will be replaced with actual camera capture
      const mockImage = `data:image/png;base64,mock-image-data-${Date.now()}`;
      setCaptures(prev => [...prev, mockImage]);
      
      // Send to backend
      await axios.post('http://localhost:5000/api/attendance/capture', {
        sessionId: state.sessionId,
        imageData: mockImage
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (err) {
      console.error('Capture failed:', err);
    }
  };

  const handleEndSession = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/sessions/${state.sessionId}/end`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      endSession();
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Failed to end session:', err);
      alert('Failed to end session');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Hosting Session: {currentSession?.title}</h2>
      <p>Session Code: {state?.sessionCode}</p>
      
      <div className="my-4">
        <h4>Next capture in: {timeLeft} seconds</h4>
        <div className="captures-grid">
          {captures.map((img, i) => (
            <img key={i} src={img} alt={`Capture ${i}`} width="150" className="m-2" />
          ))}
        </div>
      </div>

      <Button variant="danger" onClick={handleEndSession}>
        End Session
      </Button>
    </Container>
  );
}

export default StartSessionForm;