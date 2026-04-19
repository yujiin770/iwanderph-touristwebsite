import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';
import DestinationsAdmin from '../components/Admin/DestinationsAdmin';
import GalleryAdmin from '../components/Admin/GalleryAdmin';
import HeroAdmin from '../components/Admin/HeroAdmin';
import ContactAdmin from '../components/Admin/ContactAdmin';

// SVG Icons - Clean and modern
const Icons = {
  Destinations: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Gallery: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="8.5" cy="8.5" r="2.5" />
      <path d="M21 15L16 10L5 21" />
    </svg>
  ),
  Hero: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
    </svg>
  ),
  Contact: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7L12 13L2 7" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
};

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const getInitials = (email) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 150,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-sidebar-logo">
            <span>iWander PH</span>
            <i className="fas fa-sun logo-icon"></i>
          </div>
         
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/destinations"
            className={`nav-item ${location.pathname.includes('destinations') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icons.Destinations />
            <span>Destinations</span>
          </Link>
          <Link
            to="/admin/gallery"
            className={`nav-item ${location.pathname.includes('gallery') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icons.Gallery />
            <span>Gallery</span>
          </Link>
          <Link
            to="/admin/hero"
            className={`nav-item ${location.pathname.includes('hero') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icons.Hero />
            <span>Hero Section</span>
          </Link>
          <Link
            to="/admin/contact"
            className={`nav-item ${location.pathname.includes('contact') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icons.Contact />
            <span>Contact Info</span>
          </Link>
        </nav>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icons.Menu />
          </button>
          
          {/* TOP RIGHT PROFILE DROPDOWN */}
          <div className="header-profile">
            <button 
              className="profile-trigger" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // Closes menu when clicking away
            >
              <div className="user-avatar">{getInitials(user?.email)}</div>
              <span className="user-name desktop-only">{user?.email?.split('@')[0] || 'Admin'}</span>
              <div className={`chevron ${dropdownOpen ? 'open' : ''}`}>
                <Icons.ChevronDown />
              </div>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header mobile-only">
                  <p className="dropdown-name">{user?.email?.split('@')[0] || 'Admin'}</p>
                  <p className="dropdown-email">{user?.email}</p>
                </div>
                <button onClick={logout} className="dropdown-item text-danger">
                  <Icons.Logout />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-main-content">
          <Routes>
            <Route path="/destinations" element={<DestinationsAdmin />} />
            <Route path="/gallery" element={<GalleryAdmin />} />
            <Route path="/hero" element={<HeroAdmin />} />
            <Route path="/contact" element={<ContactAdmin />} />
            <Route
              path="/"
              element={
                <div className="admin-welcome">
                  <h2>Welcome back!</h2>
                  <p>Manage your destinations, gallery, and content from here.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;