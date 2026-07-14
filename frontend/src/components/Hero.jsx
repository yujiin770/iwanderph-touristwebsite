import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Hero.css';

gsap.registerPlugin(ScrollTrigger);

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

  // Determine images (Dynamic or Fallback)
  const carouselImages = Array.isArray(heroData?.images) && heroData.images.length > 0 
    ? heroData.images 
    : ["https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInitialImageLoaded, setIsInitialImageLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animations (Original layout)
      gsap.fromTo(titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(descRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );

      gsap.fromTo(buttonRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(0.8)", delay: 0.4 }
      );

      gsap.fromTo(imageContainerRef.current,
        { x: 100, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
      );

      // Parallax Effect
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (imageContainerRef.current) {
            gsap.set(imageContainerRef.current, { y: self.progress * 150 });
          }
        }
      });

      // Floating Button Animation
      gsap.to(buttonRef.current, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages]);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="container">
        <div className="hero-content">
          <h1 ref={titleRef} style={{ whiteSpace: 'pre-line' }}>
            {heroData?.title || "Explore The\nIslands of The\nPhilippines"}
          </h1>
          <p ref={descRef}>
            {heroData?.description || "Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient."}
          </p>
          <button className="explore-btn" ref={buttonRef} onClick={() => {
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) gallerySection.scrollIntoView({ behavior: 'smooth' });
          }}>
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
            {carouselImages.map((imageSrc, index) => (
              <img
                key={index}
                src={imageSrc}
                alt="Philippines Scenery"
                className="slider-image"
                onLoad={() => { if (index === 0) setIsInitialImageLoaded(true); }}
                loading="eager"
              />
            ))}
          </div>

          {isInitialImageLoaded && carouselImages.length > 1 && (
            <div className="image-indicators" ref={indicatorsRef}>
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
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