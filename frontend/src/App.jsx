import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import TechnicianDashboard from './components/TechnicianDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

function App() {
  const { user } = useAuth();

  // If not authenticated, show login page
  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: '250px',
        backgroundColor: 'white',
        minHeight: '100vh'
      }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><TicketList /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><TicketForm /></ProtectedRoute>} />
          <Route path="/ticket/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><TechnicianDashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div style={{ padding: '20px' }}><h1>Unauthorized</h1><p>You don't have permission to access this resource.</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;