import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initial state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (role = 'USER') => {
    const mockUser = {
      id: role === 'ADMIN' ? 999 : 101,
      name: role === 'ADMIN' ? 'Admin User' : 'Standard User',
      email: role === 'ADMIN' ? 'admin@campus.edu' : 'user@campus.edu',
      role: role,
      token: `mock-jwt-token-${role.toLowerCase()}`
    };
    setUser(mockUser);
    localStorage.setItem('hub_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hub_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
