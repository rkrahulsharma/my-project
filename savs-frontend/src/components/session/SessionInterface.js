import { useEffect, useContext } from 'react';
import { SessionContext } from '../../context/SessionContext';

function SessionInterface() {
  const { currentSession } = useContext(SessionContext);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!currentSession) return;
    
    const intervals = currentSession.intervals;
    let currentIntervalIndex = 0;
    
    const timer = setInterval(() => {
      // Countdown logic here
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession]);

  return (
    <div className="session-interface">
      <h2>Session: {currentSession?.name || 'Loading...'}</h2>
      <div className="capture-countdown">
        Next capture in: {timeLeft || '--'} seconds
      </div>
    </div>
  );
}