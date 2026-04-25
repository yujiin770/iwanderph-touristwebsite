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

      const sections = sectionIds.map(id => {
        const element = document.getElementById(id);
        if (element) {
          return {
            id: id,
            top: element.offsetTop - 150,
            bottom: element.offsetTop + element.offsetHeight - 150
          };
        }
        return null;
      }).filter(Boolean);

      let currentSection = 'home';
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (currentY >= section.top - 50) {
          currentSection = section.id;
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [activeSection]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
    
    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleBookNow = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <header className={`nav-header ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
      <nav className="navbar">
        <div className="logo">
          <span>IWander PH</span>
          <i className="fas fa-sun logo-icon"></i>
        </div>

        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#destinations"
              className={activeSection === 'destinations' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('destinations');
              }}
            >
              Destination
            </a>
          </li>
          <li>
            <a
              href="#gallery"
              className={activeSection === 'gallery' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('gallery');
              }}
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
            >
              Contact
            </a>
          </li>
          {/* Book Now button inside mobile menu - at the bottom */}
          <li className="mobile-book-now">
            <button onClick={handleBookNow} className="mobile-book-now-btn">
              <i className="fas fa-calendar-check"></i>
              <span>Book Now</span>
            </button>
          </li>
        </ul>

        <div className="nav-icons">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <i className={`fas fa-${theme === 'light-mode' ? 'moon' : 'sun'}`}></i>
          </button>
          
          {/* Desktop Book Now Button - Hidden on mobile */}
          {!user && (
            <button onClick={handleBookNow} className="book-now-btn desktop-only">
              <i className="fas fa-calendar-check"></i>
              <span>Book Now</span>
            </button>
          )}
          
          {/* Admin only */}
          {user && (
            <>
              <a href="/admin" className="admin-link">Admin</a>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
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