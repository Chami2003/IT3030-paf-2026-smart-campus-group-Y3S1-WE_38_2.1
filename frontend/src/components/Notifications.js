import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Check, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://localhost:8080/api/notifications/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok || response.status === 204) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllRead = async () => {
    // Optimistic update
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    try {
      const token = localStorage.getItem('jwtToken');
      // Assuming a bulk endpoint exists or calling individual ones (for demo)
      await Promise.all(unreadIds.map(id => 
        fetch(`http://localhost:8080/api/notifications/${id}/read`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok || response.status === 204) {
        setNotifications(prev => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return;
    
    const allIds = notifications.map(n => n.id);
    setNotifications([]);

    try {
      const token = localStorage.getItem('jwtToken');
      await Promise.all(allIds.map(id => 
        fetch(`http://localhost:8080/api/notifications/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) return (
    <div className="notifications-loading">
      <div className="spinner"></div>
      <p>Loading your notifications...</p>
    </div>
  );

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-left">
          <div className="bell-icon-wrapper">
            <Bell size={24} />
            {unreadCount > 0 && <span className="unread-pulse"></span>}
          </div>
          <div>
            <div className="title-row">
              <h1>Notifications</h1>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} UNREAD</span>
              )}
            </div>
            <p className="subtitle">Stay updated on your bookings and ticket progress</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={markAllRead} className="action-btn secondary">
            <Check size={16} /> Mark All Read
          </button>
          <button onClick={clearAll} className="action-btn danger">
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className="notifications-tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All <span className="tab-count">{notifications.length}</span>
        </button>
        <button 
          className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread <span className="tab-count">{unreadCount}</span>
        </button>
      </div>

      <div className="notifications-container">
        <AnimatePresence mode='popLayout'>
          {filteredNotifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <div className="empty-icon">✨</div>
              <h3>All caught up!</h3>
              <p>No {activeTab === 'unread' ? 'unread ' : ''}notifications at the moment.</p>
            </motion.div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((n, index) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`notification-card ${n.isRead ? 'read' : 'unread'}`}
                >
                  <div className="card-border"></div>
                  <div className="card-content">
                    <div className="notification-icon">
                      {n.message.toLowerCase().includes('ticket') ? (
                        <div className="icon-box ticket">
                          <AlertCircle size={20} />
                        </div>
                      ) : (
                        <div className="icon-box booking">
                          <CheckCircle2 size={20} />
                        </div>
                      )}
                    </div>
                    
                    <div className="notification-body">
                      <p className="message">{n.message}</p>
                      <div className="meta">
                        <span className="type">{n.message.toLowerCase().includes('ticket') ? 'Ticket Updated' : 'Booking Approved'}</span>
                        <span className="separator">•</span>
                        <span className="time"><Clock size={12} /> {getTimeAgo(n.createdAt)}</span>
                      </div>
                    </div>

                    <div className="notification-actions">
                      {!n.isRead && (
                        <button 
                          onClick={() => markAsRead(n.id)} 
                          className="btn-read"
                          title="Mark as read"
                        >
                          <Check size={18} /> <span>Read</span>
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(n.id)} 
                        className="btn-delete"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      {!n.isRead && <span className="unread-dot"></span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
