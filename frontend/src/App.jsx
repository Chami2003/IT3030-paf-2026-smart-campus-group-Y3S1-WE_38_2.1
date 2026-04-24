import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import TechnicianDashboard from './components/TechnicianDashboard';

function App() {
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
          <Route path="/" element={<TicketList />} />
          <Route path="/create" element={<TicketForm />} />
          <Route path="/ticket/:id" element={<TicketDetails />} />
          <Route path="/dashboard" element={<TechnicianDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;