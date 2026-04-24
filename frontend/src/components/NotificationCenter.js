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
      
      // Clear the bell badge by marking these specific resources as seen
      const faultyIds = faultyResources.map(r => r.id);
      localStorage.setItem('seenFaultyIds', JSON.stringify(faultyIds));
      
      // Instantly notify Header.js to clear its count
      window.dispatchEvent(new Event('notificationsViewed'));
      
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
      </div>

      {/* ── Notifications List ── */}
      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(resource => (
            <div className="notification-card-full" key={resource.id}>
              
              {/* Col 1: Icon */}
              <div className="nc-icon-col">
                🚨
              </div>
              
              {/* Col 2: Title & Status */}
              <div className="nc-title-col">
                <h3 className="nc-title">{resource.name}</h3>
                <span className="nc-sub">CRITICAL ALERT</span>
              </div>
              
              {/* Col 3: Type */}
              <div className="nc-meta">
                <span style={{opacity: 0.6}}>Type:</span> 
                <strong>{(resource.type || '').replace(/_/g, ' ')}</strong>
              </div>
              
              {/* Col 4: Location */}
              <div className="nc-meta">
                <span style={{opacity: 0.6}}>Location:</span> 
                <strong>{resource.location || 'N/A'}</strong>
              </div>
              
              {/* Col 5: Actions */}
              <div className="nc-actions-col">
                <button 
                  className="nc-action-btn primary" 
                  onClick={() => window.location.href = '/resources'}
                >
                  Review Issue
                </button>
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
