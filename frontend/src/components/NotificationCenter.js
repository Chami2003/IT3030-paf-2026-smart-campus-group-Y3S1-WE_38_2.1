import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';
import './NotificationCenter.css';

/**
 * NotificationCenter component — A dedicated page that lists all resources
 * currently needing maintenance (status = 'OUT_OF_SERVICE').
 */
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await resourceAPI.getAllResources();
      // Filter for resources that are OUT_OF_SERVICE
      const faultyResources = response.data.filter(r => r.status === 'OUT_OF_SERVICE');
      setNotifications(faultyResources);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      {/* ── Banner ── */}
      <div className="page-banner">
        <div>
          <h1>🔔 Notification Center</h1>
          <p>Review system alerts and maintenance requirements.</p>
        </div>
        <span className="badge-view" style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red-dark)' }}>
          System Alerts
        </span>
      </div>

      {/* ── Notifications List ── */}
      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(resource => (
            <div className="notification-card" key={resource.id}>
              <div className="notification-content">
                <h3>
                  <span className="critical-label">🚨 Critical</span>
                  {resource.name}
                </h3>
                <div className="notification-details">
                  <p><strong>Type:</strong> {(resource.type || '').replace(/_/g, ' ')}</p>
                  <p><strong>Location:</strong> {resource.location || 'Unknown'}</p>
                </div>
              </div>
              <div className="notification-time">
                <span>⏱️ Detected: Recently</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notifications">
          <span className="no-notifications-icon">✨</span>
          <h3>All Clear!</h3>
          <p>There are currently no maintenance alerts or notifications.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
