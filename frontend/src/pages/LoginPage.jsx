import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../styles/Login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
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