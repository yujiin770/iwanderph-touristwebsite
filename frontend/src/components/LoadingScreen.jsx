import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/LoadingScreen.css';

function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out loading screen
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          delay: 0.3,
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    tl.fromTo(logoRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
    )
    .fromTo(textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );

    // Minimum loading time of 1.5 seconds
    const timer = setTimeout(() => {}, 1);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen" ref={containerRef}>
      <div className="loading-content">
        <div className="loading-logo" ref={logoRef}>
          <i className="fas fa-sun"></i>
          <h1>iWander PH</h1>
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