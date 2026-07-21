import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminSettingsService } from '../services/adminSettings';
import Swal from 'sweetalert2';
import '../styles/UpdatePassword.css'; // Import the new CSS

function UpdatePasswordPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      Swal.fire('Session Expired', 'Invalid or expired link. Please request a new one.', 'error');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password.length < 6) return Swal.fire('Error', 'Minimum 6 characters', 'error');
    if (password !== confirm) return Swal.fire('Error', 'Passwords do not match', 'error');

    setSaving(true);
    try {
      await adminSettingsService.updateSessionPassword(password);
      await Swal.fire('Success', 'Password updated! Access granted.', 'success');
      navigate('/admin');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="update-password-container">Verifying session...</div>;

  return (
    <div className="update-password-container">
      <div className="update-password-card">
        <div className="update-header">
          <i className="fas fa-shield-alt brand-icon"></i>
          <h2>Set New Password</h2>
          <p>Complete setup for: <strong>{user?.email}</strong></p>
        </div>

        <form onSubmit={handleUpdate} className="update-form">
          <div className="input-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <i className="fas fa-shield-check"></i>
              <input 
                type="password" 
                value={confirm} 
                onChange={(e) => setConfirm(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;