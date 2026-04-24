import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  CalendarCheck, 
  Ticket, 
  Bell, 
  ArrowRight, 
  Mail, 
  ShieldCheck 
} from 'lucide-react';
import Notifications from '../components/Notifications';
import './Dashboard.css';

function Dashboard({ user }) {
  const [typedText, setTypedText] = useState('');
  const fullText = `Welcome, ${user?.name || 'Scholar'}!`;
  const navigate = useNavigate();

  useEffect(() => {
    let currentText = '';
    let i = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText.charAt(i);
        setTypedText(currentText);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [fullText]);

  const userRoles = user?.roles?.length > 0 ? user.roles.join(', ') : 'USER';

  return (
    <div className="dashboard-container">
      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>
            {typedText}
            <span className="typing-cursor">|</span>
          </h2>
          <div className="welcome-info">
            <p><Mail size={18} /> {user?.email}</p>
            <p><ShieldCheck size={18} /> Role Access: {userRoles}</p>
          </div>
        </section>

        <div className="modules-grid">
          <div className="module-card card-facilities">
            <div className="module-icon-wrapper">
              <Building2 size={28} />
            </div>
            <h3>Facilities & Assets</h3>
            <p>Explore our campus infrastructure. View detailed catalogues, check real-time availability, and find asset locations.</p>
            <button className="module-btn" onClick={() => navigate('/resources')}>
              Explore Catalogue <ArrowRight size={18} />
            </button>
          </div>

          <div className="module-card card-bookings">
            <div className="module-icon-wrapper">
              <CalendarCheck size={28} />
            </div>
            <h3>Resource Bookings</h3>
            <p>Reserve lecture halls, labs, and equipment for your academic activities. Track and manage your active reservations.</p>
            <button className="module-btn" onClick={() => navigate('/bookings/my')}>
              My Reservations <ArrowRight size={18} />
            </button>
          </div>

          <div className="module-card card-tickets">
            <div className="module-icon-wrapper">
              <Ticket size={28} />
            </div>
            <h3>Support Tickets</h3>
            <p>Encountered a technical issue? Raise a maintenance ticket and our technical team will resolve it promptly.</p>
            <button className="module-btn" onClick={() => navigate('/tickets')}>
              Support Desk <ArrowRight size={18} />
            </button>
          </div>

          <div className="module-card card-notifications">
            <div className="module-icon-wrapper">
              <Bell size={28} />
            </div>
            <h3>Smart Alerts</h3>
            <p>Stay updated with system announcements, booking confirmations, and critical campus resource updates.</p>
            <button className="module-btn" onClick={() => navigate('/notifications')}>
              View Notifications <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
      <Notifications />
    </div>
  );
}

export default Dashboard;
