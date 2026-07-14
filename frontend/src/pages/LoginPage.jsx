import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/Login.css';
import { adminSettingsService } from '../services/adminSettings';
import Swal from 'sweetalert2';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password States
  const [forgotOpen, setForgotOpen] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isResetMode = new URLSearchParams(location.search).get('mode') === 'reset';
  
  const formSideRef = useRef(null);
  const visualSideRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (visualSideRef.current) {
        gsap.fromTo(visualSideRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 });
      }
      const xOffset = window.innerWidth < 768 ? 20 : 50;
      gsap.fromTo(formSideRef.current, { x: xOffset, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  // Cooldown logic
  useEffect(() => {
    if (!forgotOpen) return;
    const updateCooldown = () => setCooldownSeconds(adminSettingsService.getResetCooldownRemainingSeconds(email.trim().toLowerCase()));
    updateCooldown();
    const intervalId = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(intervalId);
  }, [forgotOpen, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      gsap.to(formSideRef.current, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForgot = () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      Swal.fire('Notice', 'Please enter your Admin Email first so we can find your security question.', 'info');
      return;
    }
    const recovery = adminSettingsService.getRecoverySettings(trimmedEmail);
    if (!recovery.securityQuestion) {
      Swal.fire('Error', 'No security question found for this email on this device.', 'error');
      return;
    }
    setSecurityQuestion(recovery.securityQuestion);
    setForgotOpen(true);
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      await adminSettingsService.verifyRecoveryAnswer(trimmedEmail, securityAnswer);
      await adminSettingsService.sendPasswordReset(trimmedEmail);
      
      Swal.fire('Email Sent', 'Your answer is correct. A password reset link has been sent to your email.', 'success');
      setForgotOpen(false);
      setSecurityAnswer('');
    } catch (err) {
      Swal.fire('Verification Failed', err.message, 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="corporate-login-container">
      {/* Visual Side (Desktop) */}
      <div className="login-visual-side" ref={visualSideRef}>
        <div className="visual-overlay"></div>
        <div className="visual-content">
          <div className="corporate-logo">
            <i className="fas fa-sun logo-icon-sun"></i>
            <span>iWander PH</span>
          </div>
          <h1>Travel Portal <br/>Admin Access</h1>
          <p>Secure management for destinations, activities, and gallery content.</p>
        </div>
        <div className="visual-footer">
          <p>&copy; 2026 iWander PH.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="login-form-side" ref={formSideRef}>
        <div className="form-inner-wrapper">
          <div className="mobile-logo-header">
             <i className="fas fa-sun logo-icon-sun"></i> 
             <span>iWander PH</span>
          </div>

          <div className="form-header">
            <h2>Admin Sign In</h2>
            <p>Access your dashboard to update website content.</p>
          </div>

          <form onSubmit={handleSubmit} className="corporate-form">
            {error && <div className="corporate-error">{error}</div>}
            
            <div className="corp-input-group">
              <label>Admin Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@iwanderph.com" required />
              </div>
            </div>

            <div className="corp-input-group">
              <div className="label-row">
                <label>Password</label>
                <button type="button" className="forgot-link" onClick={handleOpenForgot}>Forgot password?</button>
              </div>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="corporate-submit-btn" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="form-footer-nav">
            <a href="/"><i className="fas fa-arrow-left"></i> Back to Home Website</a>
          </div>
        </div>
      </div>

      {/* RECOVERY MODAL */}
      {forgotOpen && (
        <div className="corp-modal-overlay">
          <div className="corp-modal">
            <div className="modal-header">
               <h3>Identity Verification</h3>
               <button className="modal-close" onClick={() => setForgotOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleVerifyAndReset} className="modal-body">
              <p className="recovery-instruction">Answer the security question you set in settings to receive a reset link.</p>
              
              <div className="corp-input-group">
                <label className="question-text">{securityQuestion}</label>
                <input 
                  type="text" 
                  className="corp-modal-input" 
                  placeholder="Your answer" 
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required 
                />
              </div>

              {cooldownSeconds > 0 && (
                <p className="cooldown-text">Wait {cooldownSeconds}s to try again.</p>
              )}

              <button 
                type="submit" 
                className="corporate-submit-btn" 
                disabled={forgotLoading || cooldownSeconds > 0}
              >
                {forgotLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Verify & Send Reset Email'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;