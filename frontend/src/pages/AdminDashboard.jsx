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
};

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
          {/* Exact Logo Copied from Public Navigation */}
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

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {getInitials(user?.email)}
            </div>
            <div className="user-info-text">
              {user?.email?.split('@')[0] || 'Admin'}
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icons.Menu />
          </button>
          { }
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