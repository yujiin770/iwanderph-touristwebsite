import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Admin.css';
import { adminSettingsService } from '../../services/adminSettings';

const RECOVERY_QUESTIONS = [
  'What is your favorite travel destination?',
  'What city were you born in?',
  'What is the name of your first pet?',
  'What is your favorite food?',
];

function SettingsAdmin() {
  const { user, theme, setThemeMode } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [recoveryForm, setRecoveryForm] = useState({
    securityQuestion: RECOVERY_QUESTIONS[0],
    securityAnswer: '',
  });
  const [status, setStatus] = useState({
    password: '',
    recovery: '',
  });
  const [error, setError] = useState({
    password: '',
    recovery: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingRecovery, setSavingRecovery] = useState(false);

  useEffect(() => {
    const savedSettings = adminSettingsService.getRecoverySettings(user?.email);

    if (savedSettings.securityQuestion) {
      setRecoveryForm((prev) => ({
        ...prev,
        securityQuestion: savedSettings.securityQuestion,
      }));
    }
  }, [user?.email]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({ ...prev, password: '' }));
    setError((prev) => ({ ...prev, password: '' }));

    if (passwordForm.newPassword.length < 6) {
      setError((prev) => ({ ...prev, password: 'Password must be at least 6 characters.' }));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError((prev) => ({ ...prev, password: 'Passwords do not match.' }));
      return;
    }

    setSavingPassword(true);

    try {
      await adminSettingsService.changePassword(passwordForm.newPassword);
      setPasswordForm({
        newPassword: '',
        confirmPassword: '',
      });
      setStatus((prev) => ({ ...prev, password: 'Password updated successfully.' }));
    } catch (err) {
      setError((prev) => ({ ...prev, password: err.message || 'Failed to update password.' }));
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRecoverySave = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({ ...prev, recovery: '' }));
    setError((prev) => ({ ...prev, recovery: '' }));

    if (!recoveryForm.securityAnswer.trim()) {
      setError((prev) => ({ ...prev, recovery: 'Please provide an answer for your security question.' }));
      return;
    }

    setSavingRecovery(true);

    try {
      await adminSettingsService.saveRecoverySettings(
        user?.email,
        recoveryForm.securityQuestion,
        recoveryForm.securityAnswer,
      );

      setRecoveryForm((prev) => ({
        ...prev,
        securityAnswer: '',
      }));
      setStatus((prev) => ({
        ...prev,
        recovery: 'Recovery question saved. Forgot password will use this on this device.',
      }));
    } catch (err) {
      setError((prev) => ({ ...prev, recovery: err.message || 'Failed to save recovery settings.' }));
    } finally {
      setSavingRecovery(false);
    }
  };

  return (
    <div className="admin-settings-page">
      <section className="admin-section">
        <h2>
          <i className="fas fa-cog"></i>
          Settings
        </h2>
        <div className="settings-intro-card">
          <p className="settings-current-email">
            Logged in as <strong>{user?.email || 'Admin'}</strong>
          </p>
          <p className="settings-intro-copy">
            This is where your client can replace the default password, pick a preferred theme, and set the
            security question used by the forgot-password flow.
          </p>
        </div>
      </section>

      <section className="admin-section">
        <h2>
          <i className="fas fa-lock"></i>
          Change Password
        </h2>
        <form className="admin-form" onSubmit={handlePasswordChange}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
                minLength={6}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Re-enter new password"
                minLength={6}
                required
              />
            </div>
          </div>

          {error.password && <p className="settings-feedback error">{error.password}</p>}
          {status.password && <p className="settings-feedback success">{status.password}</p>}

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={savingPassword}>
              {savingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2>
          <i className="fas fa-adjust"></i>
          Appearance
        </h2>
        <div className="theme-mode-grid">
          <button
            type="button"
            className={`theme-mode-card ${theme === 'light-mode' ? 'active' : ''}`}
            onClick={() => setThemeMode('light-mode')}
          >
            <i className="fas fa-sun"></i>
            <span>Light Mode</span>
          </button>
          <button
            type="button"
            className={`theme-mode-card ${theme === 'dark-mode' ? 'active' : ''}`}
            onClick={() => setThemeMode('dark-mode')}
          >
            <i className="fas fa-moon"></i>
            <span>Dark Mode</span>
          </button>
        </div>
      </section>

      <section className="admin-section">
        <h2>
          <i className="fas fa-shield-alt"></i>
          Account Recovery
        </h2>
        <form className="admin-form" onSubmit={handleRecoverySave}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="securityQuestion">Security Question</label>
              <select
                id="securityQuestion"
                value={recoveryForm.securityQuestion}
                onChange={(e) => setRecoveryForm((prev) => ({ ...prev, securityQuestion: e.target.value }))}
              >
                {RECOVERY_QUESTIONS.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="securityAnswer">Security Answer</label>
              <input
                id="securityAnswer"
                type="text"
                value={recoveryForm.securityAnswer}
                onChange={(e) => setRecoveryForm((prev) => ({ ...prev, securityAnswer: e.target.value }))}
                placeholder="Enter answer"
                required
              />
            </div>
          </div>

          {error.recovery && <p className="settings-feedback error">{error.recovery}</p>}
          {status.recovery && <p className="settings-feedback success">{status.recovery}</p>}

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={savingRecovery}>
              {savingRecovery ? 'Saving...' : 'Save Recovery Setup'}
            </button>
          </div>
        </form>
      </section>  
    </div>
  );
}

export default SettingsAdmin;
