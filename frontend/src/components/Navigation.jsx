import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

function Navigation() {
  const { user, logout, toggleTheme, theme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const sectionIds = ['home', 'destinations', 'gallery', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollYRef.current;
      const nearTop = currentY < 80;

      if (nearTop) {
        setIsVisible(true);
      } else {
        setIsVisible(!scrollingDown);
      }
      lastScrollYRef.current = currentY;

      const navOffset = 180;
      let currentSection = 'home';
      sections.forEach((section) => {
        if (section.offsetTop - navOffset <= currentY) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <header className={`nav-header ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
      <nav className="navbar">
        <div className="logo">
          <span>iWander PH</span>
          <i className="fas fa-sun logo-icon"></i>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => handleNavClick('home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#destinations"
              className={activeSection === 'destinations' ? 'active' : ''}
              onClick={() => handleNavClick('destinations')}
            >
              Destination
            </a>
          </li>
          <li>
            <a
              href="#gallery"
              className={activeSection === 'gallery' ? 'active' : ''}
              onClick={() => handleNavClick('gallery')}
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => handleNavClick('contact')}
            >
              Contact
            </a>
          </li>
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
