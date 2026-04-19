import React, { useState, useEffect } from 'react';
import { galleryService, uploadService } from '../../services/api';
import '../../styles/Admin.css';

const Icons = {
  Gallery: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Type: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>,
  Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  UploadCloud: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>,
  Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
};

function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState({ title: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const imageUrl = await uploadService.uploadImage(imageFile, 'gallery');

      const galleryPayload = { title: formData.title, url: imageUrl };
      await galleryService.create(galleryPayload);

      fetchGallery();
      setFormData({ title: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      alert('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
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


  const labelStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem' };

  return (
    <div className="admin-section">
      <h2 style={labelStyle}>
        <Icons.Gallery /> Manage Gallery
      </h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label style={labelStyle}><Icons.Type /> Photo Title</label>
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
          <label style={labelStyle}><Icons.Image /> Upload Photo</label>
          <div className="file-input-wrapper" style={{ position: 'relative' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="file-input"
              style={{ width: '100%', height: '100%', opacity: 0, position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}
              required
            />
            <div className="file-input" style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.UploadCloud />
              <span>Click or drag image to upload</span>
            </div>
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions" style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="save-btn" disabled={uploading} style={{ maxWidth: '250px' }}>
            {uploading ? (
              <><Icons.UploadCloud /> Uploading...</>
            ) : (
              <><Icons.UploadCloud /> Upload Photo</>
            )}
          </button>
        </div>
      </form>

      <div className="admin-list" style={{ marginTop: '3rem' }}>
        <h3 style={{ ...labelStyle, fontSize: '1.25rem', color: 'var(--admin-text)' }}>
          <Icons.Grid /> Gallery Photos
        </h3>

        {loading ? (
          <p style={{ color: 'var(--admin-text-secondary)' }}>Loading gallery...</p>
        ) : gallery.length === 0 ? (
          <p style={{ color: 'var(--admin-text-secondary)' }}>No photos in gallery yet.</p>
        ) : (
          <div className="gallery-admin-grid">
            {gallery.map(photo => (
              <div key={photo.id} className="gallery-admin-item">
                <img src={photo.url} alt={photo.title} />
                <h4>{photo.title}</h4>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="delete-btn"
                  style={{ ...labelStyle, justifyContent: 'center' }}
                >
                  <Icons.Trash /> Delete
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