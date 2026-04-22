import React, { useState } from 'react';


const Navigation = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-nav">
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰ Menu
      </button>
      <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <li><a href="/">Home</a></li>
        {isAuthenticated && (
          <>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/facilities">Facilities</a></li>
            <li><a href="/bookings">My Bookings</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/profile">Profile</a></li>
          </>
        )}
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;
