import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/LoadingScreen.css';

function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Lock scroll - REMOVE fixed and width settings
    document.body.style.overflow = 'hidden';

    // Simple entrance
    gsap.set(logoRef.current, { scale: 1, rotation: 0, opacity: 1 });
    gsap.set(textRef.current, { y: 0, opacity: 1 });

    const timer = setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          // Unlock scroll
          document.body.style.overflow = '';
          
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          if (onComplete) onComplete();
        }
      });
    }, 1200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);
  
  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="loading-content">
        <div className="loading-logo" ref={logoRef}>
          <i className="fas fa-sun"></i>
          <h1> iWander PH</h1>
        </div>
        <div className="loading-text" ref={textRef}>
          <p>Discover the beauty of the Philippines</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;