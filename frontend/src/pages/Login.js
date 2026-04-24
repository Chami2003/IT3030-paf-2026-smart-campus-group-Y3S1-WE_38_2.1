import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
      </svg>
    ),
    title: 'Resource Management',
    desc: 'Book rooms, labs & facilities in real-time',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
    title: 'Maintenance Tickets',
    desc: 'Report & track campus issues instantly',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
    ),
    title: 'Smart Notifications',
    desc: 'Stay updated with real-time campus alerts',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    title: 'Analytics Dashboard',
    desc: 'Insights & reports for campus operations',
  },
];

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleDeveloperLogin = () => {
    login('ADMIN');
    navigate('/dashboard');
  };

  return (
    <div className={`login-page ${mounted ? 'mounted' : ''}`}>
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      {/* Left panel */}
      <div className="login-left">
        <div className="login-left-inner">
          {/* Logo */}
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">Smart Campus</span>
              <span className="brand-tagline">Operations Hub</span>
            </div>
          </div>

          {/* Hero */}
          <div className="left-hero">
            <h1 className="left-title">
              Manage your campus<br />
              <span className="gradient-text">smarter, faster.</span>
            </h1>
            <p className="left-subtitle">
              One unified platform for resources, maintenance, bookings &amp; analytics — built for modern campuses.
            </p>
          </div>

          {/* Feature list */}
          <div className="feature-list">
            {features.map((f, i) => (
              <div className="feature-item" key={i} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – Login card */}
      <div className="login-right">
        <div className="login-card">
          {/* Card header */}
          <div className="card-header">
            <div className="card-badge">Secure Sign-In</div>
            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">
              Sign in with your university Google account to access the Smart Campus portal.
            </p>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>Continue with</span>
          </div>

          {/* Google button - Changed to direct link for better reliability */}
          <a
            id="google-signin-btn"
            className={`google-btn ${isLoading ? 'loading' : ''}`}
            href="http://localhost:8080/oauth2/authorization/google"
            onClick={() => setIsLoading(true)}
            style={{ textDecoration: 'none' }}
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <GoogleIcon />
            )}
            <span>{isLoading ? 'Redirecting…' : 'Continue with Google'}</span>
          </a>

          {/* Developer Bypass Button */}
          <button
            className="dev-bypass-btn"
            onClick={handleDeveloperLogin}
            style={{
              marginTop: '12px',
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px dashed #6366f1',
              background: 'transparent',
              color: '#6366f1',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Developer Access (Bypass OAuth)
          </button>

          {/* Info box */}
          <div className="info-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Use your <strong>@university.edu</strong> Google account for seamless access.</span>
          </div>

          {/* Footer */}
          <div className="card-footer">
            <span>© 2026 Smart Campus</span>
            <span className="dot">·</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
