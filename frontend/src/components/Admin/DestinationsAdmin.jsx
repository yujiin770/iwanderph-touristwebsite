import React, { useState, useEffect } from 'react';
import { destinationService, uploadService } from '../../services/api';
import '../../styles/Admin.css';

// Modern clean SVG Icons to replace emojis
const Icons = {
  MapPin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Map: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Target: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  List: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
};

function DestinationsAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    image: '',
    rating: '4.5',
    best_time: 'November - May',
    activities: 'Sightseeing, Photography, Nature Walks'
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await destinationService.getAll();
      setDestinations(res.data || []);
    } catch (error) {
      alert('Error fetching destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      let imageUrl = formData.image;

      if (imageFile && imageFile.type.startsWith('image/')) {
        imageUrl = await uploadService.uploadImage(imageFile, 'destinations');
      }

      // Convert activities string to array
      let activitiesArray = [];
      if (formData.activities) {
        activitiesArray = formData.activities.split(',').map(item => item.trim());
      }

      const dataToSave = {
        name: formData.name,
        label: formData.label,
        description: formData.description,
        image: imageUrl,
        rating: formData.rating,
        best_time: formData.best_time,
        activities: activitiesArray
      };

      if (editingId) {
        await destinationService.update(editingId, dataToSave);
      } else {
        await destinationService.create(dataToSave);
      }

      fetchDestinations();
      setFormData({
        name: '',
        label: '',
        description: '',
        image: '',
        rating: '4.5',
        best_time: 'November - May',
        activities: 'Sightseeing, Photography, Nature Walks'
      });
      setImageFile(null);
      setEditingId(null);
    } catch (error) {
      alert('Error saving destination: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (destination) => {
    setEditingId(destination.id);

    // Convert activities array back to string for the input field
    let activitiesString = '';
    if (destination.activities) {
      if (Array.isArray(destination.activities)) {
        activitiesString = destination.activities.join(', ');
      } else {
        activitiesString = destination.activities;
      }
    }

    setFormData({
      name: destination.name || '',
      label: destination.label || '',
      description: destination.description || '',
      image: destination.image || '',
      rating: destination.rating || '4.5',
      best_time: destination.best_time || 'November - May',
      activities: activitiesString
    });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await destinationService.delete(id);
      fetchDestinations();
      alert('Destination deleted successfully!');
    } catch (error) {
      alert('Error deleting destination: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      label: '',
      description: '',
      image: '',
      rating: '4.5',
      best_time: 'November - May',
      activities: 'Sightseeing, Photography, Nature Walks'
    });
    setImageFile(null);
  };

  // Helper style for aligning icons with text cleanly
  const labelStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem' };

  return (
    <div className="admin-section">
      <h2 style={labelStyle}>
        <Icons.Map /> Manage Destinations
      </h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label style={labelStyle}><Icons.MapPin /> Destination Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Boracay Island"
              required
            />
          </div>

          <div className="form-group">
            <label style={labelStyle}><Icons.MapPin /> Label / Location</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="e.g., Beach Paradise, Palawan"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label style={labelStyle}><Icons.Info /> Description</label>
          <textarea
            name="description"
            value={typeof formData.description === 'string' ? formData.description : ''}
            onChange={handleChange}
            placeholder="Describe the destination..."
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label style={labelStyle}><Icons.Image /> Upload Photo</label>
            <div className="file-input-wrapper" style={{ position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
                style={{ width: '100%', height: '100%', opacity: 0, position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}
              />
              <div className="file-input" style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Upload />
                <span>Click or drag image to upload</span>
              </div>
            </div>
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label style={labelStyle}><Icons.Star /> Rating</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-section" style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--admin-border)' }}>
          <h3 style={{ ...labelStyle, color: 'var(--admin-text)', marginBottom: '1rem' }}>
            <Icons.Info /> Additional Details
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label style={labelStyle}><Icons.Calendar /> Best Time to Visit</label>
              <input
                type="text"
                name="best_time"
                value={formData.best_time}
                onChange={handleChange}
                placeholder="e.g., November - May"
              />
            </div>

            <div className="form-group">
              <label style={labelStyle}><Icons.Target /> Activities (comma separated)</label>
              <input
                type="text"
                name="activities"
                value={formData.activities}
                onChange={handleChange}
                placeholder="e.g., Swimming, Hiking, Photography"
              />
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? (
              <><Icons.Upload /> Uploading...</>
            ) : (
              <><Icons.Save /> {editingId ? 'Update Destination' : 'Add Destination'}</>
            )}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="cancel-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.X /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list" style={{ marginTop: '3rem' }}>
        <h3 style={{ ...labelStyle, fontSize: '1.25rem', color: 'var(--admin-text)' }}>
          <Icons.List /> Current Destinations
        </h3>
        
        {loading ? (
          <p style={{ color: 'var(--admin-text-secondary)' }}>Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p style={{ color: 'var(--admin-text-secondary)' }}>No destinations added yet.</p>
        ) : (
          <div className="destinations-admin-grid">
            {destinations.map(dest => (
              <div key={dest.id} className="destination-admin-card">
                <img src={dest.image} alt={dest.name} />
                <div className="card-info">
                  <h4>{dest.name}</h4>
                  <p className="label">{dest.label}</p>
                  <p className="desc">{dest.description.substring(0, 60)}...</p>
                  <div className="card-actions" style={{ marginTop: '1rem' }}>
                    <button onClick={() => handleEdit(dest)} className="edit-btn" style={labelStyle}><Icons.Edit /> Edit</button>
                    <button onClick={() => handleDelete(dest.id)} className="delete-btn" style={labelStyle}><Icons.Trash /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DestinationsAdmin;