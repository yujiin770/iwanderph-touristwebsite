import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Hero.css';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Import local images
import boracayImage from '../assets/chocolate-hills.jpg';
import chocolateHillsImage from '../assets/chocolate-hills.jpg';
import siargaoImage from '../assets/siargao.jpg';
import mayonVolcanoImage from '../assets/mayon-volcano.jpg';
import coronImage from '../assets/coron.jpg';

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="image-loader">
    <i className="fas fa-spinner fa-spin"></i>
    <p>Loading amazing views...</p>
  </div>
);

function Hero({ heroData }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageTrackRef = useRef(null);
  const indicatorsRef = useRef(null);

  const localImages = [
    boracayImage,
    chocolateHillsImage,
    siargaoImage,
    mayonVolcanoImage,
    coronImage,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInitialImageLoaded, setIsInitialImageLoaded] = useState(false);

  // GSAP Animations on mount
  useEffect(() => {
    // Wait for elements to be ready
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current, 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      
      // Description animation
      gsap.fromTo(descRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
      
      // Button animation
      gsap.fromTo(buttonRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(0.8)", delay: 0.4 }
      );
      
      // Image container animation
      gsap.fromTo(imageContainerRef.current,
        { x: 100, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
      );

      // Indicators animation
      if (indicatorsRef.current) {
        gsap.fromTo(indicatorsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", delay: 0.6 }
        );
      }

      // PARALLAX EFFECT - Fixed version
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1, // This makes the animation smooth and tied to scroll
        onUpdate: (self) => {
          // Move image container up as we scroll
          if (imageContainerRef.current) {
            const moveY = self.progress * 150;
            gsap.set(imageContainerRef.current, {
              y: moveY,
              ease: "none"
            });
          }
        }
      });

      // Floating animation for button
      gsap.to(buttonRef.current, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
      });

      // Subtle pulse on image container
      gsap.to(imageContainerRef.current, {
        boxShadow: "0 30px 60px -12px rgba(0,0,0,0.4)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

    }, heroRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  // Image slider animation on change
  useEffect(() => {
    if (isInitialImageLoaded && imageTrackRef.current) {
      gsap.fromTo('.slider-image', 
        { scale: 1.05, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [currentImageIndex, isInitialImageLoaded]);

  // Auto slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % localImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [localImages.length]);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="container">
        <div className="hero-content">
          <h1 ref={titleRef}>
            {heroData?.title || "Explore The\nIslands of The\nPhilippines"}
          </h1>
          <p ref={descRef}>
            {heroData?.description || "Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient."}
          </p>
          <button className="explore-btn" ref={buttonRef}>
            Start Your Adventure
          </button>
        </div>

        <div className="hero-image-container" ref={imageContainerRef}>
          {!isInitialImageLoaded && <SkeletonLoader />}
          
          <div 
            className="slider-track"
            ref={imageTrackRef}
            style={{ 
              transform: `translateX(-${currentImageIndex * 100}%)`,
              visibility: isInitialImageLoaded ? 'visible' : 'hidden'
            }}
          >
            {localImages.map((imageSrc, index) => (
              <img
                key={index}
                src={imageSrc}
                alt={`Philippine scenery ${index + 1}`}
                className="slider-image"
                onLoad={index === 0 ? () => setIsInitialImageLoaded(true) : undefined}
                loading="eager"
              />
            ))}
          </div>

          {isInitialImageLoaded && (
            <div className="image-indicators" ref={indicatorsRef}>
              {localImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;