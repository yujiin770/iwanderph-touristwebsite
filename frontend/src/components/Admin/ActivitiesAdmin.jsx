import React, { useState, useEffect } from 'react';
import { activityService, uploadService } from '../../services/api';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';
import '../../styles/ActivitiesAdmin.css';

const Icons = {
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

function ActivitiesAdmin() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    image: ''
  });

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res = await activityService.getAll();
      setActivities(res.data || []);
    } finally { setLoading(false); }
  };

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditingId(data.id);
      setFormData({
        title: data.title,
        image: data.image
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', image: '' });
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
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
      const url = await uploadService.uploadImage(file, 'activities');
      setFormData(prev => ({ ...prev, image: url }));
      Swal.fire({ icon: 'success', title: 'Image Uploaded', timer: 1500, showConfirmButton: false });
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const dataToSave = { 
        title: formData.title.toUpperCase(), 
        image: formData.image 
      };

      if (editingId) {
        await activityService.update(editingId, dataToSave);
        Swal.fire('Updated', 'Activity saved successfully.', 'success');
      } else {
        await activityService.create(dataToSave);
        Swal.fire('Created', 'New activity added to the list.', 'success');
      }
      handleCloseModal();
      fetchActivities();
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this activity?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it'
    });
    if (result.isConfirmed) {
      await activityService.delete(id);
      fetchActivities();
      Swal.fire('Deleted', 'Activity removed from database.', 'success');
    }
  };

  const filtered = activities.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-activities-page">
      {/* Header Row */}
      <div className="admin-header-row">
        <div>
          <h2 className="premium-title">Activities</h2>
          <p className="premium-subtitle">Manage activities that appear on the homepage.</p>
        </div>
        <button className="premium-add-btn" onClick={() => handleOpenModal()}>
          <Icons.Plus /> <span>Add Activity</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="premium-card table-controls-card">
        <div className="search-wrapper">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table List */}
      <div className="premium-card table-card">
        <div className="table-responsive-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(act => (
                <tr key={act.id}>
                  <td><img src={act.image} className="table-thumb" alt="" /></td>
                  <td>
                    <strong className="activity-title">{act.title}</strong>
                  </td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="edit-icon-btn" onClick={() => handleOpenModal(act)}><Icons.Edit /></button>
                      <button className="delete-icon-btn" onClick={() => handleDelete(act.id)}><Icons.Trash /></button>
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
              <h3>{editingId ? 'Edit Activity' : 'Add New Activity'}</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}><Icons.X /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-scrollable">
              <div className="modal-form-grid">
                <div className="form-group">
                  <label>Activity Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. ISLAND HOPPING" required />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Activity Image</label>
                <div className="hero-upload-zone">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  <div className="upload-label">
                    {uploading ? "Processing Image..." : formData.image ? "Image Selected - Click to Change" : "Drag & drop activity image here"}
                  </div>
                </div>
                {formData.image && <img src={formData.image} alt="Preview" className="modal-image-preview" />}
              </div>

              <div className="modal-footer-premium">
                <button type="button" className="cancel-btn-alt" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="save-btn-premium" disabled={uploading}>
                  {uploading ? 'Syncing...' : editingId ? 'Update Activity' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivitiesAdmin;