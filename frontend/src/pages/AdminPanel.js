import React, { useState, useEffect, useCallback } from 'react';
import './AdminPanel.css';

function AdminPanel({ user, onLogout }) {
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
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId, role) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/${userId}/role?role=${role}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('User role updated successfully');
        fetchUsers();
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/auth/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert('User deleted successfully');
          fetchUsers();
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <div className="user-info">
          <span>{user?.name || 'Admin'}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="admin-content">
        <section className="users-section">
          <h2>Manage Users</h2>
          
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{u.name}</td>
                        <td>{u.roles?.join(', ') || 'USER'}</td>
                        <td>
                          <select 
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="">Update Role</option>
                            <option value="ADMIN">Add ADMIN</option>
                            <option value="TECHNICIAN">Add TECHNICIAN</option>
                            <option value="MANAGER">Add MANAGER</option>
                          </select>
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No users found</td>
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
