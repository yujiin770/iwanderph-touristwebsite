import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/api';
import '../../styles/Admin.css';

function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await galleryService.getAll();
      setGallery(res.data || []);
    } catch (error) {
      alert('Error fetching gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('url', formData.url);

    try {
      await galleryService.upload(form);
      fetchGallery();
      setFormData({ title: '', url: '' });
    } catch (error) {
      alert('Error uploading photo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await galleryService.delete(id);
      fetchGallery();
    } catch (error) {
      alert('Error deleting photo');
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Gallery</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Photo Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Sunset at Boracay"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            required
          />
        </div>

        <button type="submit" className="save-btn">
          Add Photo
        </button>
      </form>

      <div className="admin-list">
        <h3>Gallery Photos</h3>
        {loading ? (
          <p>Loading...</p>
        ) : gallery.length === 0 ? (
          <p>No photos in gallery yet.</p>
        ) : (
          <div className="gallery-admin-grid">
            {gallery.map(photo => (
              <div key={photo.id} className="gallery-admin-item">
                <img src={photo.url} alt={photo.title} />
                <h4>{photo.title}</h4>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryAdmin;
