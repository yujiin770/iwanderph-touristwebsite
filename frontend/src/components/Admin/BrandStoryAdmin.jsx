import React, { useState, useEffect } from 'react';
import { brandStoryService } from '../../services/api';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

function BrandStoryAdmin() {
  const [content, setContent] = useState({ title: '', description: '' });
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ icon: 'fas fa-star', title: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [cRes, fRes] = await Promise.all([brandStoryService.getContent(), brandStoryService.getFeatures()]);
      if (cRes.data) setContent(cRes.data);
      setFeatures(fRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdateMain = async (e) => {
    e.preventDefault();
    await brandStoryService.updateContent(content);
    Swal.fire('Saved!', 'Main content updated.', 'success');
  };

  const handleAddFeature = async (e) => {
    e.preventDefault();
    if (features.length >= 6) {
      Swal.fire('Limit Reached', 'You can only have 6 features in the grid.', 'warning');
      return;
    }
    await brandStoryService.addFeature(newFeature);
    setNewFeature({ icon: 'fas fa-star', title: '', description: '' });
    fetchData();
    Swal.fire('Added!', 'Feature card created.', 'success');
  };

  const handleDeleteFeature = async (id) => {
    const res = await Swal.fire({ title: 'Delete card?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
      await brandStoryService.deleteFeature(id);
      fetchData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-section">
      <h2><i className="fas fa-book-open"></i> Brand Story Editor</h2>

      {/* PART 1: Main Text */}
      <form onSubmit={handleUpdateMain} className="admin-form" style={{marginBottom: '40px'}}>
        <h3>Main Headline & Text</h3>
        <div className="form-group">
          <label>Section Title</label>
          <input type="text" value={content.title} onChange={e => setContent({...content, title: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Main Description</label>
          <textarea value={content.description} onChange={e => setContent({...content, description: e.target.value})} rows="3" required />
        </div>
        <button type="submit" className="save-btn" style={{background: '#2563eb'}}>Update Main Text</button>
      </form>

      <hr style={{border: 'none', borderTop: '1px solid var(--admin-border)', margin: '40px 0'}} />

      {/* PART 2: Features Grid */}
      <h3>Feature Cards ({features.length}/6)</h3>
      <form onSubmit={handleAddFeature} className="admin-form" style={{background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px'}}>
        <div className="form-row">
          <div className="form-group">
            <label>Icon Class <a href="https://fontawesome.com/search?o=r&m=free" target="_blank" rel="noreferrer" style={{fontSize: '0.7rem', color: '#3b82f6'}}>(Find icons here)</a></label>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
               <div style={{background: '#2563eb', padding: '10px', borderRadius: '8px', minWidth: '40px', textAlign: 'center'}}>
                 <i className={newFeature.icon} style={{color: 'white'}}></i>
               </div>
               <input type="text" value={newFeature.icon} onChange={e => setNewFeature({...newFeature, icon: e.target.value})} placeholder="fas fa-sun" />
            </div>
          </div>
          <div className="form-group">
            <label>Card Title</label>
            <input type="text" value={newFeature.title} onChange={e => setNewFeature({...newFeature, title: e.target.value})} placeholder="e.g. Pristine Beaches" required />
          </div>
        </div>
        <div className="form-group">
          <label>Card Short Description</label>
          <input type="text" value={newFeature.description} onChange={e => setNewFeature({...newFeature, description: e.target.value})} placeholder="Brief text..." required />
        </div>
        <button type="submit" className="save-btn" style={{background: '#10b981'}}>Add Feature Card</button>
      </form>

      <div className="destinations-admin-grid" style={{marginTop: '30px'}}>
        {features.map(f => (
          <div key={f.id} className="destination-admin-card" style={{padding: '15px'}}>
            <div style={{fontSize: '2rem', color: '#2563eb', marginBottom: '10px'}}><i className={f.icon}></i></div>
            <h4 style={{fontSize: '0.9rem'}}>{f.title}</h4>
            <p style={{fontSize: '0.75rem', color: 'var(--admin-text-secondary)'}}>{f.description}</p>
            <button onClick={() => handleDeleteFeature(f.id)} className="delete-btn" style={{background: '#ef4444', color: 'white', marginTop: '10px', width: '100%'}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrandStoryAdmin;