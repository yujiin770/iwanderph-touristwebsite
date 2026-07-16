import React, { useState, useEffect } from 'react';
import { destinationService, uploadService } from '../../services/api';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';
import '../../styles/DestinationsAdmin.css';

const MAX_RATING = 5;

const Icons = {
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

function DestinationsAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    image: '',
    rating: '4.5',
    best_time: 'November - May',
    activities: ''
  });

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    try {
      const res = await destinationService.getAll();
      setDestinations(res.data || []);
    } finally { setLoading(false); }
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditingId(data.id);
      setFormData({
        name: data.name,
        label: data.label,
        description: data.description,
        image: data.image,
        rating: data.rating,
        best_time: data.best_time || 'November - May',
        activities: Array.isArray(data.activities) ? data.activities.join(', ') : data.activities || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', label: '', description: '', image: '', rating: '4.5', best_time: 'November - May', activities: '' });
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadService.uploadImage(file, 'destinations');
      setFormData(prev => ({ ...prev, image: url }));
      Swal.fire({ icon: 'success', title: 'Image Uploaded', timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const activitiesArray = formData.activities.split(',').map(item => item.trim());
      const dataToSave = { ...formData, activities: activitiesArray };

      if (editingId) {
        await destinationService.update(editingId, dataToSave);
        Swal.fire('Updated', 'Destination saved successfully.', 'success');
      } else {
        await destinationService.create(dataToSave);
        Swal.fire('Created', 'New destination added to the list.', 'success');
      }
      handleCloseModal();
      fetchDestinations();
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this destination?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it'
    });
    if (result.isConfirmed) {
      await destinationService.delete(id);
      fetchDestinations();
      Swal.fire('Deleted', 'Item removed from database.', 'success');
    }
  };

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.label.toLowerCase().includes(searchTerm.toLowerCase())
    
  );

  return (
    <div className="admin-destinations-page">
      {/* Header Row */}
      <div className="admin-header-row">
        <div>
          <h2 className="premium-title">Destinations</h2>
          <p className="premium-subtitle">Manage travel spots across the Philippines.</p>
        </div>
        <button className="premium-add-btn" onClick={() => handleOpenModal()}>
          <Icons.Plus /> <span>Add Destination</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="premium-card table-controls-card">
        <div className="search-wrapper">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search by name or province..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table List */}
      <div className="premium-card table-card">
        <div className="table-responsive-container"> {/* ADD THIS WRAPPER */}
          <table className="premium-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Name</th>
                <th className="hide-mobile">Location</th>
                <th className="hide-mobile">Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(dest => (
                <tr key={dest.id}>
                  <td><img src={dest.image} className="table-thumb" alt="" /></td>
                  <td>
                    <strong className="dest-name">{dest.name}</strong>
                    <span className="mobile-only-subtext">{dest.label}</span> {/* Show label below name on mobile */}
                  </td>
                  <td className="hide-mobile"><span className="dest-label">{dest.label}</span></td>
                  <td className="hide-mobile"><div className="table-rating"><i className="fas fa-star"></i> {dest.rating}</div></td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="edit-icon-btn" onClick={() => handleOpenModal(dest)}><Icons.Edit /></button>
                      <button className="delete-icon-btn" onClick={() => handleDelete(dest.id)}><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="modal-header-premium">
              <h3>{editingId ? 'Edit Destination' : 'Add New Destination'}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}><Icons.X /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-scrollable">
              <div className="modal-form-grid">
                <div className="form-group">
                  <label>Destination Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Boracay Island" required />
                </div>
                <div className="form-group">
                  <label>Location / Province</label>
                  <input type="text" value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="e.g. Aklan, Visayas" required />
                </div>
                <div className="form-group">
                  <label>Rating (0.0 - 5.0)</label>
                  <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Best Time to Visit</label>
                  <input type="text" value={formData.best_time} onChange={e => setFormData({ ...formData, best_time: e.target.value })} placeholder="e.g. Nov - May" />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Featured Image</label>
                <div className="hero-upload-zone">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  <div className="upload-label">
                    {uploading ? "Processing Image..." : formData.image ? "Image Selected - Click to Change" : "Drag & drop featured photo here"}
                  </div>
                </div>
                {formData.image && <img src={formData.image} alt="Preview" className="modal-image-preview" />}
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Activities (Comma separated)</label>
                <input type="text" value={formData.activities} onChange={e => setFormData({ ...formData, activities: e.target.value })} placeholder="e.g. Swimming, Island Hopping, Snorkeling" />
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Full Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="4" placeholder="Tell visitors about this paradise..." required></textarea>
              </div>

              <div className="modal-footer-premium">
                <button type="button" className="cancel-btn-alt" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn-premium" disabled={uploading}>
                  {uploading ? 'Syncing...' : editingId ? 'Update Destination' : 'Add Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationsAdmin;