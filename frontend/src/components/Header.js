import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../services/api';

/**
 * Top header bar for the Smart Campus dashboard.
 * Displays the current page title, notification bell, user badge, and logout button.
 */
const Header = ({ user, isAuthenticated, onLogout }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCount();
      const interval = setInterval(fetchCount, 30000); // Polling every 30s
      
      const handleViewed = () => setNotificationCount(0);
      window.addEventListener('notificationsViewed', handleViewed);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsViewed', handleViewed);
      };
    }
  }, [isAuthenticated]);

  const fetchCount = async () => {
    try {
      const response = await resourceAPI.getAllResources();
      const faulty = response.data.filter(r => r.status === 'OUT_OF_SERVICE');
      
      const seenIdsStr = localStorage.getItem('seenFaultyIds');
      let unseenCount = faulty.length;
      
      if (seenIdsStr) {
        try {
          const seenIds = JSON.parse(seenIdsStr);
          const unseen = faulty.filter(r => !seenIds.includes(r.id));
          unseenCount = unseen.length;
        } catch (e) {
          console.error('Error parsing seenIds', e);
        }
      }
      
      setNotificationCount(unseenCount);
    } catch (err) {
      console.error('Failed to load notification count', err);
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>Facility Catalogue</h1>
          <span className="header-subtitle">Professional campus operations dashboard</span>
        </div>
        <div className="header-right">
          {isAuthenticated && user ? (
            <div className="user-info">
              <a href="/notifications" className="notification-bell" title="Notifications" style={{ textDecoration: 'none' }}>
                🔔
                {notificationCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: 'var(--accent-red)', color: 'white',
                    fontSize: '0.65rem', fontWeight: '800',
                    width: '18px', height: '18px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--bg-card)'
                  }}>
                    {notificationCount}
                  </span>
                )}
              </a>
              <span className="user-badge">USER</span>
              <span>{user.name || 'admin@campus.com'}</span>
              <span className="user-avatar">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-info">
              <span>Guest User</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
