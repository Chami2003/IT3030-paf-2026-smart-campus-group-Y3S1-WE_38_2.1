import React from 'react';


const Header = ({ user, isAuthenticated, onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>🏫 Smart Campus</h1>
        </div>
        <div className="header-right">
          {isAuthenticated && user ? (
            <div className="user-info">
              <span>Welcome, {user.name}</span>
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
