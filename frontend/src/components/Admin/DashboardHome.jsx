import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationService, activityService, galleryService } from '../../services/api';
import gsap from 'gsap';
import '../../styles/Admin.css';

function DashboardHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ destinations: 0, activities: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(".clean-animate", 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  const fetchStats = async () => {
    try {
      const [dest, act, gal] = await Promise.all([
        destinationService.getAll(),
        activityService.getAll(),
        galleryService.getAll()
      ]);
      setStats({
        destinations: dest.data?.length || 0,
        activities: act.data?.length || 0,
        gallery: gal.data?.length || 0
      });
    } finally { setLoading(false); }
  };

  const QuickLink = ({ title, icon, path }) => (
    <button className="clean-action-card clean-animate" onClick={() => navigate(path)}>
      <i className={icon}></i>
      <span>{title}</span>
    </button>
  );

  if (loading) return <div className="admin-loader-simple">Loading Overview...</div>;

  return (
    <div className="clean-dashboard">
      <header className="clean-header clean-animate">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here is your website status.</p>
        </div>
        <div className="clean-date">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>

      {/* STATS SECTION */}
      <div className="clean-stats-grid">
        <div className="clean-stat-item clean-animate">
          <span className="stat-label">Destinations</span>
          <div className="stat-value">{stats.destinations}</div>
        </div>
        <div className="clean-stat-item clean-animate">
          <span className="stat-label">Activities</span>
          <div className="stat-value">{stats.activities}</div>
        </div>
        <div className="clean-stat-item clean-animate">
          <span className="stat-label">Gallery Photos</span>
          <div className="stat-value">{stats.gallery}</div>
        </div>
      </div>

      <div className="clean-main-grid">
        {/* QUICK ACTIONS */}
        <section className="clean-section clean-animate">
          <h3>Quick Management</h3>
          <div className="clean-actions-list">
            <QuickLink title="Add Destination" icon="fas fa-plus" path="/admin/destinations" />
            <QuickLink title="Upload Gallery" icon="fas fa-image" path="/admin/gallery" />
            <QuickLink title="Edit Hero" icon="fas fa-edit" path="/admin/hero" />
            <QuickLink title="Settings" icon="fas fa-cog" path="/admin/settings" />
          </div>
        </section>

        {/* SYSTEM STATUS */}
        <section className="clean-section clean-animate">
          <h3>Connection Status</h3>
          <div className="clean-status-card">
            <div className="status-row">
              <span className="status-indicator online"></span>
              <span>Database (Supabase)</span>
              <span className="status-tag">Connected</span>
            </div>
            <div className="status-row">
              <span className="status-indicator online"></span>
              <span>Storage Buckets</span>
              <span className="status-tag">Active</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardHome;