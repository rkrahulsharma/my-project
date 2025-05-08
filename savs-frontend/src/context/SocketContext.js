// src/context/SocketContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create the socket context
const SocketContext = createContext();

// Custom hook to use socket context
export const useSocket = () => useContext(SocketContext);

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    // Connect to backend Socket.IO server
    const newSocket = io('http://localhost:5000'); // ✅ Update if needed
    setSocket(newSocket);

    // Set socket ID when connected
    newSocket.on('connect', () => {
      setId(newSocket.id);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, id }}>
      {children}
    </SocketContext.Provider>
  );
};
