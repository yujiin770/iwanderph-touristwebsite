import React, { useState, useEffect } from 'react';
import { heroService } from '../../services/api';
import '../../styles/Admin.css';

const Icons = {
  Monitor: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  Type: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>,
  AlignLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  Loader: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
};

function HeroAdmin() {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await heroService.get();
      if (res.data) setFormData(res.data);
    } catch (error) {
      console.error('Error fetching hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await heroService.update(formData);
      alert('Hero section updated successfully!');
      fetchHero();
    } catch (error) {
      alert('Error updating hero section');
    } finally {
      setUpdating(false);
    }
  };

  const labelStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem' };

  return (
    <div className="admin-section">
      <h2 style={labelStyle}>
        <Icons.Monitor /> Edit Hero Section
      </h2>

      {loading ? (
        <p style={{ color: 'var(--admin-text-secondary)' }}>Loading hero data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label style={labelStyle}><Icons.Type /> Main Title</label>
            <textarea
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Explore The Islands of The Philippines"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}><Icons.AlignLeft /> Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Discover the stunning beaches..."
              rows="4"
              required
            />
          </div>

          <div className="form-actions" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="save-btn" disabled={updating} style={{ maxWidth: '250px' }}>
              {updating ? (
                <><Icons.Loader /> Updating...</>
              ) : (
                <><Icons.Save /> Update Hero Section</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default HeroAdmin;