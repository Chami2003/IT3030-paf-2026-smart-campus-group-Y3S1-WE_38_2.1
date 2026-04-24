import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch('http://localhost:8081/api/notifications/me', {
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
      const response = await fetch(`http://localhost:8081/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok || response.status === 204) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8081/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok || response.status === 204) {
        setNotifications(notifications.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <h3>Your Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map(n => (
            <li key={n.id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
              <div className="notification-content">
                <p className="notification-message">{n.message}</p>
                <small className="notification-date">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
              {!n.isRead && (
                <button onClick={() => markAsRead(n.id)} className="read-btn">
                  Mark as read
                </button>
              )}
              <button onClick={() => deleteNotification(n.id)} className="read-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
