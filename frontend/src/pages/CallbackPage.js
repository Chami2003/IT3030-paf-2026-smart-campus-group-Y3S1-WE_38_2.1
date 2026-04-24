import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CallbackPage() {
  const { setAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      })
      .then(data => {
        setAuth(data, token);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Processing login...</p>
    </div>
  );
}

export default CallbackPage;
