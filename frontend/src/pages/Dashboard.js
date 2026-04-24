import React from 'react';
import Notifications from '../components/Notifications';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Smart Campus Dashboard</h1>
        <div className="user-info">
          {user && user.picture && (
            <img src={user.picture} alt="Profile" className="user-avatar" />
          )}
          <span>{user?.name || 'User'}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user?.name}!</h2>
          <p>You are logged in as: {user?.email}</p>
          <p>Your roles: {user?.roles?.join(', ') || 'USER'}</p>
        </div>

        <div className="modules-grid">
          <div className="module-card">
            <h3>Facilities & Assets</h3>
            <p>View and manage campus resources</p>
            <button>Go to Facilities</button>
          </div>

          <div className="module-card">
            <h3>Bookings</h3>
            <p>Manage your bookings</p>
            <button>Go to Bookings</button>
          </div>

          <div className="module-card">
            <h3>Support Tickets</h3>
            <p>Report and track issues</p>
            <button>Go to Tickets</button>
          </div>

          <div className="module-card">
            <h3>Notifications</h3>
            <p>View your notifications</p>
            <button>Go to Notifications</button>
          </div>
        </div>
      </main>
      <Notifications />
    </div>
  );
}

export default Dashboard;
