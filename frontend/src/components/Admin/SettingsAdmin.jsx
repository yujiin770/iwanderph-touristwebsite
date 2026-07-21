import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminSettingsService } from '../../services/adminSettings';
import { supabase } from '../../lib/supabase'; // Needed for verification
import Swal from 'sweetalert2';
import '../../styles/AdminSettings.css';
import '../../styles/Admin.css';

function SettingsAdmin() {
  const { user, theme, setThemeMode } = useAuth();
  
  // States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState({ password: false, invite: false });

  // --- Handlers ---

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, invite: true });
    try {
      await adminSettingsService.sendAdminInvite(inviteEmail);
      Swal.fire('Invitation Sent', `A setup link has been sent to ${inviteEmail}`, 'success');
      setInviteEmail('');
    } catch (err) {
      Swal.fire('Notice', err.message, 'info');
    } finally {
      setLoading({ ...loading, invite: false });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return Swal.fire('Error', 'New passwords do not match', 'error');
    }
    if (passwordForm.newPassword.length < 6) {
      return Swal.fire('Error', 'Password must be at least 6 characters', 'error');
    }

    setLoading({ ...loading, password: true });

    try {
      // 2. Verify Current Password (Re-authentication)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      });

      if (signInError) {
        throw new Error("The 'Current Password' you entered is incorrect.");
      }

      // 3. Perform the update
      await adminSettingsService.changePassword(passwordForm.newPassword);

      Swal.fire('Success', 'Password updated successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  return (
    <div className="admin-settings-container">
      {/* HEADER */}
      <div className="settings-section">
        <h2><i className="fas fa-cog"></i> Account Preferences</h2>
        <div className="settings-intro-card">
          <span className="settings-current-email">Signed in as {user?.email}</span>
          <p className="settings-intro-copy">Manage your security settings and administrative permissions.</p>
        </div>
      </div>

      {/* INVITE NEW ADMIN */}
      <div className="settings-section">
        <h2><i className="fas fa-user-plus"></i> Invite Administrator</h2>
        <form onSubmit={handleInvite} className="settings-form">
          <div className="form-group">
            <label>New Admin Email</label>
            <input 
              type="email" 
              placeholder="e.g. employee@iwanderph.com"
              value={inviteEmail} 
              onChange={(e) => setInviteEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="settings-btn" disabled={loading.invite}>
            <i className={loading.invite ? "fas fa-spinner fa-spin" : "fas fa-paper-plane"}></i>
            {loading.invite ? 'Processing...' : 'Send Invitation Link'}
          </button>
        </form>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="settings-section">
        <h2><i className="fas fa-lock"></i> Update Security</h2>
        <form onSubmit={handlePasswordChange} className="settings-form">
          <div className="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              placeholder="Confirm it is you"
              value={passwordForm.currentPassword} 
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
              required 
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="Min. 6 characters"
                value={passwordForm.newPassword} 
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                placeholder="Repeat new password"
                value={passwordForm.confirmPassword} 
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="settings-btn" disabled={loading.password}>
            <i className="fas fa-shield-alt"></i>
            {loading.password ? 'Verifying...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* APPEARANCE */}
      <div className="settings-section">
        <h2><i className="fas fa-palette"></i> Interface Theme</h2>
        <div className="theme-grid">
          <div 
            className={`theme-card ${theme === 'light-mode' ? 'active' : ''}`} 
            onClick={() => setThemeMode('light-mode')}
          >
            <i className="fas fa-sun"></i> Light Mode
          </div>
          <div 
            className={`theme-card ${theme === 'dark-mode' ? 'active' : ''}`} 
            onClick={() => setThemeMode('dark-mode')}
          >
            <i className="fas fa-moon"></i> Dark Mode
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsAdmin;