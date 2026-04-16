import React, { useState, useEffect } from 'react';
import { heroService } from '../../services/api';
import '../../styles/Admin.css';

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

  return (
    <div className="admin-section">
      <h2>🎯 Edit Hero Section</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Main Title</label>
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
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Discover the stunning beaches..."
              rows="4"
              required
            />
          </div>

          <button type="submit" className="save-btn" disabled={updating}>
            {updating ? '⏳ Updating...' : '💾 Update Hero Section'}
          </button>
        </form>
      )}
    </div>
  );
}

export default HeroAdmin;