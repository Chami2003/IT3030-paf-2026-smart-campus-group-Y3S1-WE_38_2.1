import React, { useState, useEffect, useCallback } from 'react';
import { Users, Trash2, Shield, Loader2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPanel.css';

function AdminPanel({ user: currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Failed to fetch system users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Connection error while fetching users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId, role) => {
    if (!role) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth/${userId}/role?role=${role}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success(`Role added: ${role}`);
        fetchUsers();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error connecting to authentication service');
    }
  };

  const deleteUser = async (userId, userEmail) => {
    if (userEmail === currentUser?.email) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('User deleted successfully');
          fetchUsers();
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error connecting to server');
      }
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>System Configuration</h1>
      </header>

      <main className="admin-content">
        <section className="users-section">
          <h2>
            <Users size={24} />
            User Management
          </h2>
          
          {loading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" size={40} />
              <p>Syncing user database...</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Identity</th>
                    <th>Full Name</th>
                    <th>Permissions</th>
                    <th>Control</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <span className="user-email">{u.email}</span>
                        </td>
                        <td>
                          <span className="user-name">{u.name || 'N/A'}</span>
                        </td>
                        <td>
                          <div className="role-badges">
                            {u.roles && u.roles.length > 0 ? (
                              u.roles.map((r, i) => (
                                <span key={i} className="role-badge">
                                  <Shield size={10} style={{ marginRight: '4px' }} />
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="role-badge" style={{ opacity: 0.5 }}>USER</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <select 
                              className="role-select"
                              onChange={(e) => updateUserRole(u.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="">Grant Access...</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="TECHNICIAN">TECHNICIAN</option>
                              <option value="MANAGER">MANAGER</option>
                            </select>
                            <button 
                              onClick={() => deleteUser(u.id, u.email)}
                              className="delete-btn"
                              title="Delete User"
                              disabled={u.email === currentUser?.email}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <UserCheck size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No registered users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;
