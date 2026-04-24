import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import CallbackPage from './pages/CallbackPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Header from './components/Header';
import ResourceCatalogue from './components/ResourceCatalogue';
import ResourceAnalytics from './components/ResourceAnalytics';
import NotificationCenter from './components/NotificationCenter';
import { useAuth } from './context/AuthContext';

// Ticketing Components
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import TicketDetails from './components/TicketDetails';
import TechnicianDashboard from './components/TechnicianDashboard';

// Booking Components
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';

import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, isAuthenticated, setAuth, logout: contextLogout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          // Keep the existing user data if it's already in state, 
          // otherwise try to load from localStorage
          if (!user) {
            const savedUser = localStorage.getItem('hub_user');
            if (savedUser) {
              setAuth(JSON.parse(savedUser), token);
            }
          }
        } else {
          contextLogout();
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        contextLogout();
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        await fetch('http://localhost:8080/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      contextLogout();
      window.location.href = '/login';
    }
  };

  if (loading) {
    return <div className="loading">Loading Smart Campus...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer position="top-right" autoClose={5000} theme="light" />
        <Header user={user} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Navigation isAuthenticated={isAuthenticated} user={user} />

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<CallbackPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard user={user} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="ADMIN">
                    <AdminPanel user={user} />
                  </ProtectedRoute>
                }
              />

              {/* Facilities Management Routes */}
              <Route
                path="/resources"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ResourceCatalogue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ResourceAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <NotificationCenter />
                  </ProtectedRoute>
                }
              />

              {/* Maintenance Ticketing Routes */}
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <TicketList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/new"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <TicketForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <TicketDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="ADMIN">
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Booking Workflow Routes */}
              <Route
                path="/bookings/new"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <BookingForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/my"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/admin"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="ADMIN">
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Smart Campus Management System</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
