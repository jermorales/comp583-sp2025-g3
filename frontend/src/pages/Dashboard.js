import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <p>Welcome! Here you will see your appointments and notifications.</p>
      <button
        onClick={() => navigate('/appointments')}
        style={{ marginTop: '1rem', padding: '10px 20px', fontSize: '16px' }}
      >
        View Appointments
      </button>
    </div>
  );
};

export default Dashboard;