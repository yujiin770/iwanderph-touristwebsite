import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/Login.css';
import { adminSettingsService } from '../services/adminSettings';
import Swal from 'sweetalert2';

function LoginPage() {
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password States
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  
  const formSideRef = useRef(null);
  const visualSideRef = useRef(null);

  // GSAP Entrance Animations
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

  // Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
      // Shake animation on error
      gsap.to(formSideRef.current, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
    } finally {
      setLoading(false);
    }
  };

const handleForgotPassword = async (e) => {
  e.preventDefault();
  setForgotLoading(true);
  try {
    await adminSettingsService.requestPasswordReset(forgotEmail);
    Swal.fire('Success', 'Check your Gmail for the reset link!', 'success');
    setForgotOpen(false);
  } catch (err) {
    // This will now catch "Email already sent. Wait 5 minutes."
    Swal.fire('Notice', err.message, 'info'); 
  } finally {
    setForgotLoading(false);
  }
};

  return (
    <div className="corporate-login-container">
      {/* VISUAL SIDE (DESKTOP) */}
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

      {/* FORM SIDE */}
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
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@iwanderph.com" 
                  required 
                />
              </div>
            </div>

            <div className="corp-input-group">
              <div className="label-row">
                <label>Password</label>
                <button 
                  type="button" 
                  className="forgot-link" 
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
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

            <button type="submit" className="corporate-submit-btn" disabled={loading}>
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="form-footer-nav">
            <a href="/"><i className="fas fa-arrow-left"></i> Back to Home Website</a>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL (EMAIL BASED) */}
      {forgotOpen && (
        <div className="corp-modal-overlay">
          <div className="corp-modal">
            <div className="modal-header">
               <h3>Reset Password</h3>
               <button className="modal-close" onClick={() => setForgotOpen(false)}>
                 <i className="fas fa-times"></i>
               </button>
            </div>
            <form onSubmit={handleForgotPassword} className="modal-body">
              <p className="recovery-instruction">
                Enter your administrator email. We will send a secure link to reset your password.
              </p>
              
              <div className="corp-input-group">
                <label>Registered Email</label>
                <input 
                  type="email" 
                  className="corp-modal-input" 
                  placeholder="name@iwanderph.com" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="corporate-submit-btn" 
                disabled={forgotLoading}
              >
                {forgotLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Send Reset Link'}
              </button>
              
              <button 
                type="button" 
                className="modal-cancel-text" 
                onClick={() => setForgotOpen(false)}
              >
                Back to Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;