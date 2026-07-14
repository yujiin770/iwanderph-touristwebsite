import React, { useState, useEffect } from 'react';
import { heroService, uploadService } from '../../services/api';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

const MAX_IMAGES = 5;

const Icons = {
  Monitor: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>
};

function HeroAdmin() {
  const [formData, setFormData] = useState({ title: '', description: '', images: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchHero(); }, []);

  const fetchHero = async () => {
    try {
      const res = await heroService.get();
      if (res.data) setFormData({
        title: res.data.title || '',
        description: res.data.description || '',
        images: res.data.images || []
      });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (formData.images.length >= MAX_IMAGES) {
      Swal.fire('Limit Reached', `Maximum of ${MAX_IMAGES} images allowed.`, 'warning');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadService.uploadImage(file, 'hero');
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'Image added to list. Remember to save text changes if you made any.',
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  // AUTOMATIC DELETE WITH CONFIRMATION
  const handleDeleteImage = async (idx) => {
    const result = await Swal.fire({
      title: 'Remove Image?',
      text: "This image will be removed from the homepage carousel immediately.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        setUploading(true);
        // Create the updated list
        const updatedImages = formData.images.filter((_, i) => i !== idx);
        const updatedData = { ...formData, images: updatedImages };

        // Sync with Database immediately
        await heroService.update(updatedData);

        // Update local state
        setFormData(updatedData);

        Swal.fire({
          title: 'Deleted!',
          text: 'The carousel has been updated.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to remove image from database.', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      await heroService.update(formData);
      Swal.fire('Saved!', 'Title, Description, and Images are now live.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to save changes.', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Icons.Monitor /> Hero Section Editor
      </h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group">
            <label>Headline Title</label>
            <textarea
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              rows="3"
              placeholder="Headline text..."
              required
            />
          </div>
          <div className="form-group">
            <label>Description Text</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '20px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><Icons.Image /> Carousel Images ({formData.images.length}/{MAX_IMAGES})</span>
          </label>

          <div className="file-input-wrapper" style={{ position: 'relative', marginTop: '10px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                cursor: formData.images.length >= MAX_IMAGES ? 'not-allowed' : 'pointer',
                zIndex: 2
              }}
              disabled={uploading || formData.images.length >= MAX_IMAGES}
            />
            <div className="file-input" style={{ opacity: formData.images.length >= MAX_IMAGES ? 0.5 : 1 }}>
              <Icons.Upload />
              <span style={{ marginLeft: '10px' }}>
                {uploading
                  ? 'Processing file...'
                  : formData.images.length >= MAX_IMAGES
                    ? 'Limit reached (5/5)'
                    : 'Drag and drop an image here or click to browse'}
              </span>
            </div>
          </div>

          <div className="hero-images-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px', marginTop: '20px' }}>
            {formData.images.map((url, i) => (
              <div key={i} className="hero-preview-card" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '110px', border: '2px solid var(--admin-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                <button
                  type="button"
                  onClick={() => handleDeleteImage(i)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    zIndex: 10
                  }}
                  title="Delete Immediately"
                >
                  <Icons.Trash />
                </button>
                <div style={{ position: 'absolute', bottom: '0', left: '0', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderTopRightRadius: '8px' }}>
                  Image {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '30px' }}>
          <button type="submit" className="save-btn" style={{ width: '100%', padding: '15px', fontSize: '1rem', background: '#2563eb' }} disabled={uploading}>
            {uploading ? 'Updating...' : <><Icons.Save /> SAVE TEXT & IMAGE CHANGES</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HeroAdmin;