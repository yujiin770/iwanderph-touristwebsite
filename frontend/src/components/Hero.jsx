import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';

// Import local images
import boracayImage from '../assets/chocolate-hills.jpg';
import chocolateHillsImage from '../assets/chocolate-hills.jpg';
import siargaoImage from '../assets/siargao.jpg';
import mayonVolcanoImage from '../assets/mayon-volcano.jpg';
import coronImage from '../assets/coron.jpg';

// NEW: A more visible loader component with a spinner icon
const ImageLoader = () => (
  <div className="image-loader">
    <i className="fas fa-spinner fa-spin"></i>
    <p>Loading Images...</p>
  </div>
);

function Hero({ heroData }) {
  const localImages = [
    boracayImage,
    chocolateHillsImage,
    siargaoImage,
    mayonVolcanoImage,
    coronImage,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInitialImageLoaded, setIsInitialImageLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % localImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [localImages.length]);

  return (
    <section className="hero">
      <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div className="hero-content">
          <h1>
            {heroData?.title || "Explore The\nIslands of The\nPhilippines"}
          </h1>
          <p>
            {heroData?.description || "Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient."}
          </p>
          <button className="explore-btn">Start Your Adventure</button>
        </div>

        <div className="hero-image-container">
          {/* Show the new spinner loader if the first image hasn't loaded */}
          {!isInitialImageLoaded && <ImageLoader />}

          <div
            className="slider-track"
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
            <div className="image-indicators">
              {localImages.map((_, idx) => (
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