import React from 'react';

/**
 * Top header bar for the Smart Campus dashboard.
 * Displays the current page title, notification bell, user badge, and logout button.
 */
const Header = ({ user, isAuthenticated, onLogout }) => {
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
              <span className="notification-bell" title="Notifications">🔔</span>
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
