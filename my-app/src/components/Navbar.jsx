import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import bookIcon from '/vite.svg'; // Using Vite logo as a placeholder book icon

const Navbar = ({ currentUser, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <img src={bookIcon} alt="Biblioteca Online" className="navbar-logo-img" />
          <h1>Biblioteca Online</h1>
        </Link>
      </div>
      
      <div className="navbar-menu">
        <NavLink to="/" className={({ isActive }) => 
          isActive ? "navbar-item active" : "navbar-item"
        } end>
          Inicio
        </NavLink>
        
        {currentUser && (
          <NavLink to="/profile" className={({ isActive }) => 
            isActive ? "navbar-item active" : "navbar-item"
          }>
            Mi Perfil
          </NavLink>
        )}
      </div>
      
      <div className="navbar-auth">
        {currentUser ? (
          <div className="navbar-user">
            <span className="navbar-username">Hola, {currentUser.name}</span>
            <button onClick={onLogout} className="navbar-logout">
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-login">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;