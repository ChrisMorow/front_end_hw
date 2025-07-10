import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

// This component is now just a simple wrapper that redirects to the LoginPage
// It's kept for backward compatibility with existing code
const Login = ({ currentUser, onLogout }) => {
  if (currentUser) {
    return (
      <div className="login-container logged-in">
        <p>Bienvenido, {currentUser.name}</p>
        <button onClick={onLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <Link to="/login" className="login-button">
        Iniciar sesión
      </Link>
    </div>
  );
};

export default Login;
