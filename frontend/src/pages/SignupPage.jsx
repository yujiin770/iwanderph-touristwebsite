// frontend/src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminSettingsService } from '../services/adminSettings';
import Swal from 'sweetalert2';
import '../styles/Login.css'; // Reuse login styles

function SignupPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If auth finished loading and there is no user, they shouldn't be here
    if (!loading && !user) {
      Swal.fire('Access Denied', 'Invalid or expired setup link.', 'error');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleFinalize = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return Swal.fire('Error', 'Password must be at least 6 characters.', 'error');
    }
    if (password !== confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match.', 'error');
    }

    setSubmitting(true);
    try {
      await adminSettingsService.finalizeSignup(password);
      await Swal.fire('Success', 'Account secured! You can now login.', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="loading-screen">Verifying link...</div>;

  return (
    <div className="corporate-login-container">
      <div className="login-form-side" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
        <div className="form-inner-wrapper">
          <div className="form-header">
            <h2>Complete Registration</h2>
            <p>Setting up account for: <strong>{user?.email}</strong></p>
          </div>

          <form onSubmit={handleFinalize} className="corporate-form">
            <div className="corp-input-group">
              <label>Create Password</label>
              <div className="input-with-icon">
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

            <div className="corp-input-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <i className="fas fa-shield-alt"></i>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="corporate-submit-btn" disabled={submitting}>
              {submitting ? 'Finalizing...' : 'Set Password & Complete'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;