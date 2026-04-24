import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from '../components/Notifications';
import './Dashboard.css';

function Dashboard({ user }) {
  const [typedText, setTypedText] = useState('');
  const fullText = `Welcome, ${user?.name || 'User'}!`;
  const navigate = useNavigate();

  useEffect(() => {
    let currentText = '';
    let i = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText.charAt(i);
        setTypedText(currentText);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100); // 100ms per character

    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <div className="dashboard-container">

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>
            {typedText}
            <span className="typing-cursor">|</span>
          </h2>
          <p>You are logged in as: {user?.email}</p>
          <p>Your roles: {(user?.role === 'ADMIN' || user?.email?.includes('admin') || user?.email === 'chamiduhimahansa2003@gmail.com') ? 'ADMIN' : 'USER'}</p>
        </div>

        <div className="modules-grid">
          <div className="module-card">
            <h3>Facilities & Assets</h3>
            <p>View and manage campus resources</p>
            <button onClick={() => navigate('/resources')}>Go to Facilities</button>
          </div>

          <div className="module-card">
            <h3>Bookings</h3>
            <p>Manage your bookings</p>
            <button onClick={() => navigate('/bookings/my')}>Go to Bookings</button>
          </div>

          <div className="module-card">
            <h3>Support Tickets</h3>
            <p>Report and track issues</p>
            <button onClick={() => navigate('/tickets')}>Go to Tickets</button>
          </div>

          <div className="module-card">
            <h3>Notifications</h3>
            <p>View your notifications</p>
            <button onClick={() => navigate('/notifications')}>Go to Notifications</button>
          </div>
        </div>
      </main>
      <Notifications />
    </div>
  );
}

export default Dashboard;
