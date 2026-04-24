import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkStyle = (path) => {
    const isActive = path === '/' 
      ? location.pathname === '/' || location.pathname.startsWith('/ticket') 
      : location.pathname.startsWith(path);
    return {
      display: 'block',
      padding: '15px 20px',
      color: isActive ? '#fff' : '#b8c7ce',
      textDecoration: 'none',
      backgroundColor: isActive ? '#007bff' : 'transparent',
      borderLeft: isActive ? '4px solid #fff' : '4px solid transparent',
      transition: 'all 0.3s ease'
    };
  };

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#222d32',
      color: '#fff',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ padding: '20px', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #1a2226', textAlign: 'center' }}>
          Smart Campus
        </div>
        <div style={{ padding: '10px 20px', fontSize: '12px', color: '#4b646f', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Operations Hub
        </div>
        <nav>
          <Link to="/" style={getLinkStyle('/')}>Tickets List</Link>
          <Link to="/create" style={getLinkStyle('/create')}>Create Ticket</Link>
          <Link to="/dashboard" style={getLinkStyle('/dashboard')}>Technician Dashboard</Link>
        </nav>
      </div>
      <div style={{ borderTop: '1px solid #1a2226', padding: '15px' }}>
        {user && (
          <>
            <div style={{ fontSize: '12px', color: '#4b646f', marginBottom: '10px' }}>
              <strong>{user.name}</strong><br/>
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
