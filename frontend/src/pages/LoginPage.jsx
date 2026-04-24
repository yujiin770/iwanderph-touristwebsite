import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/Login.css';
import { adminSettingsService } from '../services/adminSettings';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [resetForm, setResetForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isResetMode = new URLSearchParams(location.search).get('mode') === 'reset';
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background fade in
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );
      
      // Form slide up animation
      gsap.fromTo(formRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: "back.out(0.6)",
          delay: 0.2
        }
      );
      
      // Header animation
      gsap.fromTo(headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.3 }
      );
      
      // Button pulse animation
      gsap.to(buttonRef.current, {
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!forgotOpen) {
      setCooldownSeconds(0);
      return undefined;
    }

    const updateCooldown = () => {
      setCooldownSeconds(
        adminSettingsService.getResetCooldownRemainingSeconds(email.trim().toLowerCase())
      );
    };

    updateCooldown();
    const intervalId = window.setInterval(updateCooldown, 1000);

    return () => window.clearInterval(intervalId);
  }, [forgotOpen, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Button click animation
    gsap.to(buttonRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      // Shake animation on error
      gsap.to(formRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedEmail) {
        throw new Error('Enter your admin email first.');
      }

      const recoverySettings = adminSettingsService.getRecoverySettings(trimmedEmail);

      if (!recoverySettings.securityQuestion) {
        throw new Error('No security question was saved for this email on this device yet.');
      }

      setSecurityQuestion(recoverySettings.securityQuestion);

      await adminSettingsService.verifyRecoveryAnswer(trimmedEmail, securityAnswer);
      await adminSettingsService.sendPasswordReset(trimmedEmail);

      setForgotSuccess('Answer confirmed. A password reset email has been sent.');
      setSecurityAnswer('');
      setCooldownSeconds(adminSettingsService.getResetCooldownRemainingSeconds(trimmedEmail));
    } catch (err) {
      setForgotError(err.message || 'Unable to start password recovery.');
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotPassword = () => {
    const recoverySettings = adminSettingsService.getRecoverySettings(email.trim().toLowerCase());
    setSecurityQuestion(recoverySettings.securityQuestion || '');
    setForgotError('');
    setForgotSuccess('');
    setSecurityAnswer('');
    setCooldownSeconds(adminSettingsService.getResetCooldownRemainingSeconds(email.trim().toLowerCase()));
    setForgotOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      if (resetForm.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      if (resetForm.newPassword !== resetForm.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      await adminSettingsService.changePassword(resetForm.newPassword);
      setResetForm({
        newPassword: '',
        confirmPassword: '',
      });
      setResetSuccess('Password reset complete. You can now continue to the admin dashboard.');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setResetError(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-page" ref={containerRef}>
      <div className="login-bg-pattern"></div>
      <div className="login-container">
        <div className="login-form-wrapper" ref={formRef}>
          <div className="login-header" ref={headerRef}>
            <div className="login-logo">
              <i className="fas fa-sun"></i>
              <h1>iWander PH</h1>
            </div>
            <p>Admin Access Portal</p>
          </div>

          {isResetMode ? (
            <form onSubmit={handleResetPassword} className="login-form">
              {resetError && <div className="error-message">{resetError}</div>}
              {resetSuccess && <div className="success-message">{resetSuccess}</div>}

              <div className="forgot-password-copy reset-copy">
                Set a new password after opening the recovery email link.
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="resetNewPassword"
                  value={resetForm.newPassword}
                  onChange={(e) => setResetForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="New Password"
                  required
                />
              </div>

              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="resetConfirmPassword"
                  value={resetForm.confirmPassword}
                  onChange={(e) => setResetForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm New Password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={resetLoading}
                ref={buttonRef}
              >
                {resetLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Updating...
                  </>
                ) : (
                  'Save New Password'
                )}
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-lock"></i>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>

                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={openForgotPassword}
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={loading}
                  ref={buttonRef}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Logging in...
                    </>
                  ) : (
                    <>
                      Access Dashboard <i ></i>
                    </>
                  )}
                </button>
              </form>

              {forgotOpen && (
                <form className="forgot-password-panel" onSubmit={handleForgotPassword}>
                  <div className="forgot-password-header">
                    <h3>Recover Admin Access</h3>
                    <button
                      type="button"
                      className="forgot-close-btn"
                      onClick={() => {
                        setForgotOpen(false);
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <p className="forgot-password-copy">
                    Use the security question saved in Settings. After the correct answer, a reset email will be sent
                    to the admin email.
                  </p>

                  <div className="forgot-password-question">
                    <label htmlFor="securityAnswer">
                      {securityQuestion || 'No security question found yet for this email.'}
                    </label>
                    <input
                      id="securityAnswer"
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      disabled={!securityQuestion}
                      required
                    />
                  </div>

                  {forgotError && <div className="error-message">{forgotError}</div>}
                  {forgotSuccess && <div className="success-message">{forgotSuccess}</div>}
                  {cooldownSeconds > 0 && (
                    <div className="forgot-countdown">
                      Try again in {cooldownSeconds} second{cooldownSeconds === 1 ? '' : 's'}.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="login-btn forgot-submit-btn"
                    disabled={forgotLoading || !securityQuestion || cooldownSeconds > 0}
                  >
                    {forgotLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Verifying...
                      </>
                    ) : (
                      'Verify and Send Reset'
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          <div className="login-footer">
            <a href="/">
              <i className="fas fa-home"></i> Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
