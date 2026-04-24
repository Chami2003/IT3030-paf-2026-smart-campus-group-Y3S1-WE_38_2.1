import React from 'react';
import './Login.css';

function Login() {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Smart Campus</h1>
          <p>Operations Management Hub</p>
        </div>

        <div className="login-content">
          <h2>Welcome</h2>
          <p>Sign in with your Google account to continue</p>

          <button className="google-login-button" onClick={handleGoogleSignIn}>
            Continue with Google
          </button>
        </div>

        <div className="login-footer">
          <p>&copy; 2026 Smart Campus. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
