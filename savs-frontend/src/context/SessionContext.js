import { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [captureIntervals, setCaptureIntervals] = useState([]);

  const startSession = async (sessionData) => {
    // TODO: Connect to backend API
    const newSession = {
      id: Date.now(),
      ...sessionData,
      isActive: true
    };
    setCurrentSession(newSession);
    return newSession;
  };

  return (
    <SessionContext.Provider value={{ currentSession, startSession }}>
      {children}
    </SessionContext.Provider>
  );
};