import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

function Navigation() {
  const { user, logout, toggleTheme, theme } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const sectionIds = ['home', 'destinations', 'gallery', 'contact'];
    
    const onScroll = () => {
      const currentY = window.scrollY;
      
      // 1. Handle Visibility (Hide on scroll down, show on scroll up)
      const scrollingDown = currentY > lastScrollYRef.current;
      const threshold = 80; // Only hide after scrolling 80px

      if (currentY <= threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(!scrollingDown);
      }

      // 2. Handle Background Change (Glassmorphism effect)
      setIsScrolled(currentY > 20);

      lastScrollYRef.current = currentY;

      // 3. Handle Active Section Highlighting
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in the top portion of the viewport
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (section) => {
    setMenuOpen(false);
    setActiveSection(section);
    
    const element = document.getElementById(section);
    if (element) {
      // Calculate offset so fixed header doesn't cover section title
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleBookNow = () => {
    handleNavClick('contact');
  };

  return (
    <header 
      className={`nav-header 
        ${isVisible ? 'nav-visible' : 'nav-hidden'} 
        ${isScrolled ? 'nav-scrolled' : ''}`
      }
    >
      <nav className="navbar">
        <div className="logo" onClick={() => handleNavClick('home')}>
          <span>iWander PH</span>
          <i className="fas fa-sun logo-icon"></i>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#destinations"
              className={activeSection === 'destinations' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('destinations'); }}
            >
              Destination
            </a>
          </li>
          <li>
            <a
              href="#gallery"
              className={activeSection === 'gallery' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
            >
              Contact
            </a>
          </li>
          
          <li className="mobile-book-now">
            <button onClick={handleBookNow} className="mobile-book-now-btn">
              <i className="fas fa-calendar-check"></i>
              <span>Book Now</span>
            </button>
          </li>
        </ul>

        <div className="nav-icons">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas fa-${theme === 'light-mode' ? 'moon' : 'sun'}`}></i>
          </button>
          
          {!user && (
            <button onClick={handleBookNow} className="book-now-btn desktop-only">
              <i className="fas fa-calendar-check"></i>
              <span>Book Now</span>
            </button>
          )}
          
          {user && (
            <div className="admin-controls">
              <a href="/admin" className="admin-link">Admin</a>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          )}
          
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navigation;