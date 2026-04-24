import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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
      roles: [role],
      token: `mock-jwt-token-${role.toLowerCase()}`
    };
    setAuth(mockUser, mockUser.token);
  };

  const setAuth = (userData, token) => {
    const userWithRole = {
      ...userData,
      role: userData.role || (userData.roles && userData.roles.includes('ADMIN') ? 'ADMIN' : 'USER')
    };
    setUser(userWithRole);
    localStorage.setItem('hub_user', JSON.stringify(userWithRole));
    localStorage.setItem('jwtToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hub_user');
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      logout, 
      setAuth,
      isAdmin: user?.role === 'ADMIN' || user?.roles?.includes('ADMIN')
    }}>
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
