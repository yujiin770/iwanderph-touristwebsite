import React, { useState, useEffect } from 'react';
import { destinationService, uploadService } from '../../services/api';
import '../../styles/Admin.css';

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

  // MAKE SURE THIS DELETE FUNCTION EXISTS
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

  return (
    <div className="admin-section">
      <h2>🏝️ Manage Destinations</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Destination Name</label>
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
            <label>Label / Location</label>
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
          <label>Description</label>
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
            <label>📸 Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="file-input"
            />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>⭐ Rating</label>
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

        {/* ADDITIONAL DETAILS - ONLY 2 FIELDS */}
        <div className="form-section">
          <h3>📋 Additional Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>📅 Best Time to Visit</label>
              <input
                type="text"
                name="best_time"
                value={formData.best_time}
                onChange={handleChange}
                placeholder="e.g., November - May"
              />
            </div>

            <div className="form-group">
              <label>🎯 Activities (comma separated)</label>
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

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? '⏳ Uploading...' : '💾 ' + (editingId ? 'Update' : 'Add') + ' Destination'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="cancel-btn">
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <h3>📍 Current Destinations</h3>
        {loading ? (
          <p>Loading...</p>
        ) : destinations.length === 0 ? (
          <p>No destinations added yet.</p>
        ) : (
          <div className="destinations-admin-grid">
            {destinations.map(dest => (
              <div key={dest.id} className="destination-admin-card">
                <img src={dest.image} alt={dest.name} />
                <div className="card-info">
                  <h4>{dest.name}</h4>
                  <p className="label">{dest.label}</p>
                  <p className="desc">{dest.description.substring(0, 50)}...</p>
                  <div className="card-actions">
                    <button onClick={() => handleEdit(dest)} className="edit-btn">✏️ Edit</button>
                    <button onClick={() => handleDelete(dest.id)} className="delete-btn">🗑️ Delete</button>
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