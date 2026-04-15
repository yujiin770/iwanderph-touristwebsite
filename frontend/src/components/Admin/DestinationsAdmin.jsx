import React, { useState, useEffect } from 'react';
import { destinationService } from '../../services/api';
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
  });
  const [loading, setLoading] = useState(true);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await destinationService.update(editingId, formData);
      } else {
        await destinationService.create(formData);
      }
      fetchDestinations();
      setFormData({ name: '', label: '', description: '', image: '', rating: '4.5' });
      setEditingId(null);
    } catch (error) {
      alert('Error saving destination');
    }
  };

  const handleEdit = (destination) => {
    setEditingId(destination.id);
    setFormData(destination);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      await destinationService.delete(id);
      fetchDestinations();
    } catch (error) {
      alert('Error deleting destination');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', label: '', description: '', image: '', rating: '4.5' });
  };

  return (
    <div className="admin-section">
      <h2>Manage Destinations</h2>

      <form onSubmit={handleSubmit} className="admin-form">
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
          <label>Label</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Beach Paradise"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the destination..."
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="form-group">
          <label>Rating</label>
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

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {editingId ? 'Update' : 'Add'} Destination
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-list">
        <h3>Current Destinations</h3>
        {loading ? (
          <p>Loading...</p>
        ) : destinations.length === 0 ? (
          <p>No destinations added yet.</p>
        ) : (
          <div className="list-items">
            {destinations.map(dest => (
              <div key={dest.id} className="list-item">
                <div className="item-info">
                  <h4>{dest.name}</h4>
                  <p>{dest.label}</p>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => handleEdit(dest)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
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
