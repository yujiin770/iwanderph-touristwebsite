import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

function Navigation() {
  const { user, logout, toggleTheme, theme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav-header">
      <nav className="navbar">
        <div className="logo">
          <span>iWander PH</span>
          <i className="fas fa-sun logo-icon"></i>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><a href="#home" className="active">Home</a></li>
          <li><a href="#destinations">Destination</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="nav-icons">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <i className={`fas fa-${theme === 'light-mode' ? 'moon' : 'sun'}`}></i>
          </button>
          {user ? (
            <>
              <a href="/admin" className="admin-link">Admin</a>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <a href="/login" className="login-link">Login</a>
          )}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
