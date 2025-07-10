import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = ({ onLogin, currentUser }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError('Por favor ingresa un ID de usuario.');
      return;
    }

    try {
      // Call the login API
      onLogin(userId);
      navigate('/'); // Redirect to home page after login
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Usuario no encontrado. Intenta con "user123" o "user456".');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userId">ID de usuario:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ingresa tu ID de usuario"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
          <p className="login-hint">
            Prueba con los IDs: "user123" o "user456"
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
