// src/components/SessionPerformance.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const SessionPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/session/performance')
      .then(res => setPerformanceData(res.data.performance))
      .catch(err => console.error('Error fetching performance data:', err));
  }, []);

  const data = {
    labels: performanceData.map(session => session.title),
    datasets: [
      {
        label: 'Attendees',
        data: performanceData.map(session => session.attendees),
        backgroundColor: '#007bff',
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Performance (Last 5 Sessions)</h3>
      {performanceData.length === 0 ? (
        <p>No performance data available.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default SessionPerformance;