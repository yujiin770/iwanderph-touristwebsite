import React, { useState, useEffect } from 'react';
import { activityService, uploadService } from '../../services/api';
import Swal from 'sweetalert2';
import '../../styles/Admin.css';

const MAX_ACTIVITIES = 5;

const Icons = {
  Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
};

function ActivitiesAdmin() {
  const [activities, setActivities] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res = await activityService.getAll();
      setActivities(res.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
                                                                                                       } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // VALIDATION
    if (!newTitle.trim()) {
      Swal.fire('Wait!', 'Please enter an Activity Title first.', 'warning');
      return;
    }

    if (activities.length >= MAX_ACTIVITIES) {
      Swal.fire('Limit Reached', `You can only have ${MAX_ACTIVITIES} activities on the homepage.`, 'warning');
      return;
    }

    try {
      setUploading(true);
      // 1. Upload to Supabase Storage
      const imageUrl = await uploadService.uploadImage(file, 'activities');
      
      // 2. Save to Database
      await activityService.create({ 
        title: newTitle.toUpperCase(), 
        image: imageUrl 
      });

      // 3. Reset and Refresh
      setNewTitle('');
      fetchActivities();
      Swal.fire('Added!', 'New activity is now live on the homepage.', 'success');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This activity will be removed from the homepage immediately.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await activityService.delete(id);
        fetchActivities(); // Refresh list
        Swal.fire('Deleted!', 'The activity has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && activities.length === 0) return <div className="admin-loading">Loading Activities...</div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Icons.Activity /> Homepage Activities Manager
        </h2>
        <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '1.5rem' }}>
          Add or remove the activities that appear in the expanding cards section.
        </p>
      </div>

      {/* ADD NEW ACTIVITY FORM */}
      <div className="admin-form" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid var(--admin-border)' }}>
        <div className="form-group">
          <label>Activity Title</label>
          <input 
            type="text" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            placeholder="e.g. ISLAND HOPPING ADVENTURE"
            disabled={uploading || activities.length >= MAX_ACTIVITIES}
          />
        </div>

        <div className="file-input-wrapper" style={{ position: 'relative', marginTop: '15px' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAddActivity}
            style={{
              opacity: 0, position: 'absolute', width: '100%', height: '100%', 
              cursor: (uploading || activities.length >= MAX_ACTIVITIES) ? 'not-allowed' : 'pointer',
              zIndex: 2
            }}
            disabled={uploading || activities.length >= MAX_ACTIVITIES}
          />
          <div className="file-input" style={{ opacity: activities.length >= MAX_ACTIVITIES ? 0.5 : 1 }}>
            <Icons.Upload />
            <span style={{ marginLeft: '10px' }}>
              {uploading ? 'Uploading...' : activities.length >= MAX_ACTIVITIES ? 'Limit reached (5/5)' : 'Drag & drop image here to add Activity'}
            </span>
          </div>
        </div>
        <small style={{ display: 'block', marginTop: '8px', color: 'var(--admin-text-secondary)' }}>
          {activities.length} of {MAX_ACTIVITIES} slots used.
        </small>
      </div>

      {/* ACTIVITIES LIST GRID */}
      <div className="admin-list" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', color: 'var(--admin-text)' }}>Current Activities</h3>
        
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)', border: '1px dashed var(--admin-border)', borderRadius: '15px' }}>
            No activities found. Add your first one above!
          </div>
        ) : (
          <div className="destinations-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {activities.map((act) => (
              <div key={act.id} className="destination-admin-card" style={{ position: 'relative', background: 'var(--admin-surface)', borderRadius: '15px', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                <img src={act.image} alt={act.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div className="card-info" style={{ padding: '15px' }}>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', textTransform: 'uppercase' }}>{act.title}</h4>
                  <button 
                    onClick={() => handleDelete(act.id)} 
                    className="delete-btn" 
                    style={{ 
                      width: '100%', background: '#ef4444', color: 'white', border: 'none', 
                      padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600'
                    }}
                  >
                    <Icons.Trash /> DELETE ACTIVITY
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

export default ActivitiesAdmin;