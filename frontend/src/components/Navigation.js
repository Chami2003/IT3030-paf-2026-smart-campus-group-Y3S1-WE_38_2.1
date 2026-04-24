import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar Navigation component for the Smart Campus dashboard.
 * Renders a fixed left sidebar with navigation links and icons.
 */
const Navigation = ({ isAuthenticated, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const location = useLocation();
  const currentPath = location.pathname;

  const isAdmin = user && (user.role === 'ADMIN' || user.email?.includes('admin') || user.email === 'chamiduhimahansa2003@gmail.com');

  return (
    <nav className={`main-nav ${isMenuOpen ? 'nav-open' : ''}`}>


      {/* Mobile toggle */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰ Menu
      </button>

      {/* Navigation links */}
      <ul className="nav-menu">
        <li>
          <Link to="/" className={currentPath === '/' ? 'active' : ''}>
            <span className="nav-icon">🏠</span> Overview
          </Link>
        </li>
        
        {isAuthenticated && (
          <>
            <p className="nav-section-title">MANAGEMENT</p>
            <li>
              <Link to="/dashboard" className={currentPath === '/dashboard' ? 'active' : ''}>
                <span className="nav-icon">📊</span> Dashboard
              </Link>
            </li>
            
            <li>
              <Link to="/resources" className={currentPath === '/resources' ? 'active' : ''}>
                <span className="nav-icon">🏢</span> Facility Catalogue
              </Link>
            </li>

            <p className="nav-section-title">MAINTENANCE</p>
            <li>
              <Link to="/tickets" className={currentPath === '/tickets' ? 'active' : ''}>
                <span className="nav-icon">🔧</span> Maintenance Tickets
              </Link>
            </li>
            <li>
              <Link to="/tickets/new" className={currentPath === '/tickets/new' ? 'active' : ''}>
                <span className="nav-icon">➕</span> Raise Ticket
              </Link>
            </li>

            <p className="nav-section-title">BOOKINGS</p>
            <li>
              <Link to="/bookings/new" className={currentPath === '/bookings/new' ? 'active' : ''}>
                <span className="nav-icon">📅</span> New Request
              </Link>
            </li>
            <li>
              <Link to="/bookings/my" className={currentPath === '/bookings/my' ? 'active' : ''}>
                <span className="nav-icon">📖</span> My Bookings
              </Link>
            </li>

            {isAdmin && (
              <>
                <p className="nav-section-title">ADMINISTRATION</p>
                <li>
                  <Link to="/technician/dashboard" className={currentPath === '/technician/dashboard' ? 'active' : ''}>
                    <span className="nav-icon">🛠️</span> Tech Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/bookings/admin" className={currentPath === '/bookings/admin' ? 'active' : ''}>
                    <span className="nav-icon">👮</span> Booking Admin
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className={currentPath === '/admin' ? 'active' : ''}>
                    <span className="nav-icon">⚙️</span> System Config
                  </Link>
                </li>
              </>
            )}

            <p className="nav-section-title">SYSTEM</p>
            <li>
              <Link to="/analytics" className={currentPath === '/analytics' ? 'active' : ''}>
                <span className="nav-icon">📈</span> Analytics
              </Link>
            </li>
            <li>
              <Link to="/notifications" className={currentPath === '/notifications' ? 'active' : ''}>
                <span className="nav-icon">🔔</span> Notification Center
              </Link>
            </li>
          </>
        )}
      </ul>

      <style jsx="true">{`
        .nav-section-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          padding: 1.5rem 1.5rem 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
