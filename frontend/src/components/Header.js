import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, ShieldCheck } from 'lucide-react';
import { resourceAPI } from '../services/api';

const Header = ({ user, isAuthenticated, onLogout }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCount();
      const interval = setInterval(fetchCount, 30000);
      
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

  const userRoles = user?.roles?.length > 0 ? user.roles[0] : 'USER';

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>Smart Campus Dashboard</h1>
          <span className="header-subtitle">Intelligent Resource Management</span>
        </div>
        
        <div className="header-right">
          {isAuthenticated && user ? (
            <div className="user-info">
              <a href="/notifications" className="notification-bell" title="Notifications">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
                )}
              </a>
              
              <div className="divider"></div>
              
              <div className="user-profile-group">
                <span className="user-badge">
                  <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                  {userRoles}
                </span>
                
                <div className="user-details">
                  <span className="user-name">{user.name || 'Scholar'}</span>
                </div>

                <div className="avatar-wrapper">
                  <div className="user-avatar">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="user-photo" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <span className="status-indicator"></span>
                </div>
              </div>

              <button className="logout-btn" onClick={onLogout} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="guest-info">
              <span>Guest Session</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .divider {
          width: 1px;
          height: 24px;
          background: var(--border-color);
          margin: 0 0.5rem;
        }
        .user-profile-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.25rem 0.5rem 0.25rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid var(--border-color);
        }
        .user-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--text-heading);
        }
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--accent-red);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          padding: 0;
          border-radius: 10px;
        }
      `}</style>
    </header>
  );
};

export default Header;
