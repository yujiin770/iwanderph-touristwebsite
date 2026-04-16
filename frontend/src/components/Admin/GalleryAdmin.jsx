import React, { useState, useEffect } from 'react';
import { galleryService, uploadService } from '../../services/api';
import '../../styles/Admin.css';

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

  return (
    <div className="admin-section">
      <h2>📸 Manage Gallery</h2>

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
          <label>📤 Upload Photo</label>
          <input type="file" accept="image/*" onChange={handleImageSelect} className="file-input" required />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="save-btn" disabled={uploading}>
          {uploading ? '⏳ Uploading...' : '📤 Upload Photo'}
        </button>
      </form>

      <div className="admin-list">
        <h3>🖼️ Gallery Photos</h3>
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
                <button onClick={() => handleDelete(photo.id)} className="delete-btn">🗑️ Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryAdmin;