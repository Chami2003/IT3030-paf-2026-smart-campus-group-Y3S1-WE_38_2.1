import React, { useState } from 'react';

/**
 * Sidebar Navigation component for the Smart Campus dashboard.
 * Renders a fixed left sidebar with navigation links and icons.
 */
const Navigation = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const currentPath = window.location.pathname;

  return (
    <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>
      {/* Sidebar brand */}
      <div className="sidebar-brand">
        <h2>🏫 Smart Campus</h2>
        <span className="brand-sub">Operations Hub</span>
      </div>

      {/* Mobile toggle */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰ Menu
      </button>

      {/* Navigation links */}
      <ul className="nav-menu">
        <li>
          <a href="/" className={currentPath === '/' ? 'active' : ''}>
            <span className="nav-icon">🏠</span> Overview
          </a>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <a href="/dashboard" className={currentPath === '/dashboard' ? 'active' : ''}>
                <span className="nav-icon">📊</span> Dashboard
              </a>
            </li>
            <li>
              <a href="/resources" className={currentPath === '/resources' ? 'active' : ''}>
                <span className="nav-icon">🏢</span> Facility Catalogue
              </a>
            </li>
            <li>
              <a href="/analytics" className={currentPath === '/analytics' ? 'active' : ''}>
                <span className="nav-icon">📈</span> Analytics
              </a>
            </li>
            <li>
              <a href="/notifications" className={currentPath === '/notifications' ? 'active' : ''}>
                <span className="nav-icon" style={{ position: 'relative' }}>
                  🔔
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px',
                    background: 'var(--accent-red)', borderRadius: '50%'
                  }}></span>
                </span>
                Notifications
              </a>
            </li>
            <li>
              <a href="/bookings" className={currentPath === '/bookings' ? 'active' : ''}>
                <span className="nav-icon">📅</span> Booking Requests
              </a>
            </li>
            <li>
              <a href="/facilities" className={currentPath === '/facilities' ? 'active' : ''}>
                <span className="nav-icon">🔧</span> All Incidents
              </a>
            </li>
            <li>
              <a href="/events" className={currentPath === '/events' ? 'active' : ''}>
                <span className="nav-icon">🔔</span> Notifications
              </a>
            </li>
            <li>
              <a href="/profile" className={currentPath === '/profile' ? 'active' : ''}>
                <span className="nav-icon">👤</span> Account
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
