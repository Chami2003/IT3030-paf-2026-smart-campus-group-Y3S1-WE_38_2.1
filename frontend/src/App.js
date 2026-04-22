import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Header from './components/Header';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {

          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="loading">Loading Smart Campus...</div>;
  }

  return (
    <div className="App">
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Navigation isAuthenticated={isAuthenticated} />
      <main className="main-content">
        {/* Routes will be defined here */}
        <div className="container">
          {isAuthenticated ? (
            <div className="dashboard">
              <h1>Welcome to Smart Campus</h1>
              <p>Select an option from the navigation menu</p>
            </div>
          ) : (
            <div className="login-page">
              <h1>Please Log In</h1>
              <p>Log in to access Smart Campus services</p>
            </div>
          )}
        </div>
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Smart Campus - IT3030 PAF Group Y3S1-WE_38</p>
      </footer>
    </div>
  );
}

export default App;
