import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';

function Hero({ heroData }) {
  const [images, setImages] = useState([
    "https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg",
    "https://images.pexels.com/photos/11995818/pexels-photo-11995818.jpeg",
    "https://images.pexels.com/photos/1598991/pexels-photo-1598991.jpeg",
    "https://images.pexels.com/photos/2085739/pexels-photo-2085739.jpeg",
    "https://images.pexels.com/photos/236681/pexels-photo-236681.jpeg"
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="home" className="hero">
      <div className="container" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <div className="hero-content">
          <h1>
            {heroData?.title || "Explore The\nIslands of The\nPhilippines"}
          </h1>
          <p>
            {heroData?.description || "Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient."}
          </p>
          <button className="explore-btn">Start Your Adventure →</button>
        </div>
        <div className="hero-image-container">
          <img
            src={images[currentImageIndex]}
            alt="Beautiful Philippine beach"
            className="slider-image"
          />
          <div className="image-indicators">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
