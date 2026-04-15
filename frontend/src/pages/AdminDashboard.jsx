import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';
import DestinationsAdmin from '../components/Admin/DestinationsAdmin';
import GalleryAdmin from '../components/Admin/GalleryAdmin';
import HeroAdmin from '../components/Admin/HeroAdmin';
import ContactAdmin from '../components/Admin/ContactAdmin';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>iWander Admin</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/destinations"
            className={`nav-item ${location.pathname.includes('destinations') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-map-pin"></i>
            <span>Destinations</span>
          </Link>
          <Link
            to="/admin/gallery"
            className={`nav-item ${location.pathname.includes('gallery') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-images"></i>
            <span>Gallery</span>
          </Link>
          <Link
            to="/admin/hero"
            className={`nav-item ${location.pathname.includes('hero') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-star"></i>
            <span>Hero Section</span>
          </Link>
          <Link
            to="/admin/contact"
            className={`nav-item ${location.pathname.includes('contact') ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-envelope"></i>
            <span>Contact Info</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <span>{user?.email}</span>
          </div>
          <button onClick={logout} className="logout-btn" title="Sign out">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <button
            className="mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        <Routes>
          <Route path="/destinations" element={<DestinationsAdmin />} />
          <Route path="/gallery" element={<GalleryAdmin />} />
          <Route path="/hero" element={<HeroAdmin />} />
          <Route path="/contact" element={<ContactAdmin />} />
          <Route
            path="/"
            element={
              <div className="admin-welcome">
                <h2>👋 Welcome, {user?.email?.split('@')[0]}!</h2>
                <p>Select an option from the sidebar to manage your content.</p>
                <p style={{ marginTop: '2rem', fontSize: '0.95rem', opacity: 0.8 }}>
                  ✨ Use the modern admin panel to edit your tourist destination content, gallery photos, hero section, and contact information.
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
