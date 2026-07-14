import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';
import DestinationsAdmin from '../components/Admin/DestinationsAdmin';
import ActivitiesAdmin from '../components/Admin/ActivitiesAdmin';
import BrandStoryAdmin from '../components/Admin/BrandStoryAdmin';
import GalleryAdmin from '../components/Admin/GalleryAdmin';
import HeroAdmin from '../components/Admin/HeroAdmin';
import ContactAdmin from '../components/Admin/ContactAdmin';
import SettingsAdmin from '../components/Admin/SettingsAdmin';
import DashboardHome from '../components/Admin/DashboardHome';
const Icons = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  Destinations: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  Activities: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  Story: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  Gallery: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="8.5" cy="8.5" r="2.5" /><path d="M21 15L16 10L5 21" /></svg>,
  Hero: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" /></svg>,
  Contact: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7L12 13L2 7" /></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.4.1" /></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
};

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  }, [location.pathname]);

  const getInitials = (email) => email ? email.charAt(0).toUpperCase() : 'A';

  return (
    <div className="admin-dashboard">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-sidebar-logo">
            <span>iWander PH</span>
            <i className="fas fa-sun logo-icon"></i>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}><Icons.Dashboard /> <span>Dashboard</span></Link>
          <Link to="/admin/destinations" className={`nav-item ${location.pathname.includes('destinations') ? 'active' : ''}`}><Icons.Destinations /> <span>Destinations</span></Link>
          <Link to="/admin/activities" className={`nav-item ${location.pathname.includes('activities') ? 'active' : ''}`}><Icons.Activities /> <span>Activities</span></Link>
          <Link to="/admin/brand-story" className={`nav-item ${location.pathname.includes('brand-story') ? 'active' : ''}`}><Icons.Story /> <span>Brand Story</span></Link>
          <Link to="/admin/gallery" className={`nav-item ${location.pathname.includes('gallery') ? 'active' : ''}`}><Icons.Gallery /> <span>Gallery</span></Link>
          <Link to="/admin/hero" className={`nav-item ${location.pathname.includes('hero') ? 'active' : ''}`}><Icons.Hero /> <span>Hero Section</span></Link>
          <Link to="/admin/contact" className={`nav-item ${location.pathname.includes('contact') ? 'active' : ''}`}><Icons.Contact /> <span>Contact Info</span></Link>
          <Link to="/admin/settings" className={`nav-item ${location.pathname.includes('settings') ? 'active' : ''}`}><Icons.Settings /> <span>Settings</span></Link>
        </nav>

        {/* LOGOUT MOVED TO SIDEBAR BOTTOM */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar-small">{getInitials(user?.email)}</div>
            <div className="user-details">
              <p className="user-email-text">{user?.email?.split('@')[0]}</p>
            </div>
          </div>
          <button onClick={logout} className="logout-button-sidebar">
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-top-bar">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Icons.Menu />
          </button>
          <div className="top-bar-title">Dashboard / {location.pathname.split('/').pop()}</div>
        </header>

        <main className="admin-main-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/destinations" element={<DestinationsAdmin />} />
            <Route path="/activities" element={<ActivitiesAdmin />} />
            <Route path="/brand-story" element={<BrandStoryAdmin />} />
            <Route path="/gallery" element={<GalleryAdmin />} />
            <Route path="/hero" element={<HeroAdmin />} />
            <Route path="/contact" element={<ContactAdmin />} />
            <Route path="/settings" element={<SettingsAdmin />} />
            <Route path="/" element={<div className="admin-welcome"><h2>Welcome, {user?.email?.split('@')[0]}!</h2><p>Select a section from the sidebar to start managing your website.</p></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;