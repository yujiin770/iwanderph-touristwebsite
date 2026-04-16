import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Activities.css';

// Import your specific images for each activity
import hanginTulayImage from '../assets/chocolate-hills.jpg';
import panoramicImage from '../assets/chocolate-hills.jpg';
import spelunkingImage from '../assets/siargao.jpg';
import islandHoppingImage from '../assets/mayon-volcano.jpg';
import waterfallImage from '../assets/coron.jpg';

function Activities() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const activities = [
    {
      id: 1,
      title: "HANGIN TULAY OCTOPUS ADVENTURE",
      image: hanginTulayImage,
      buttonText: "Explore"
    },
    {
      id: 2,
      title: "GET PANORAMIC VIEWS OF PLACER",
      image: panoramicImage,
      buttonText: "Explore"
    },
    {
      id: 3,
      title: "SPELUNKING AT CUYAPNIT CAVE",
      image: spelunkingImage,
      buttonText: "Explore"
    },
    {
      id: 4,
      title: "ISLAND HOPPING ADVENTURE",
      image: islandHoppingImage,
      buttonText: "Explore"
    },
    {
      id: 5,
      title: "WATERFALL TREKKING",
      image: waterfallImage,
      buttonText: "Explore"
    }
  ];

  // Check screen size for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide for mobile carousel
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMobile, activities.length]);

  // Preload images
  useEffect(() => {
    activities.forEach((activity) => {
      const img = new Image();
      img.src = activity.image;
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [activity.id]: true }));
      };
    });
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activities.length);
  };

  const handleExploreClick = () => {
    navigate('/activities');
  };

  return (
    <section className="activities-section">
      <div className="activities-container">
        <div className="activities-header">
          <span className="pre-title">THINGS TO DO</span>
          <h2>ACTIVITIES</h2>
        </div>

        {/* Desktop View */}
        {!isMobile && (
          <div className="activities-grid">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`activity-card ${hoveredId === activity.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredId(activity.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="activity-image-wrapper">
                  {!imagesLoaded[activity.id] && (
                    <div className="image-placeholder"></div>
                  )}
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    style={{ 
                      opacity: imagesLoaded[activity.id] ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                  <div className="activity-overlay">
                    <h3>{activity.title}</h3>
                    <button 
                      className="explore-activity-btn"
                      onClick={handleExploreClick}
                    >
                      {activity.buttonText} <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile View */}
        {isMobile && (
          <div className="activities-carousel">
            <div className="carousel-container">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {activities.map((activity) => (
                  <div key={activity.id} className="carousel-slide">
                    <div className="activity-image-wrapper">
                      <img src={activity.image} alt={activity.title} />
                      <div className="activity-overlay">
                        <h3>{activity.title}</h3>
                        <button 
                          className="explore-activity-btn"
                          onClick={handleExploreClick}
                        >
                          {activity.buttonText} <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="carousel-arrow prev" onClick={goToPrev}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="carousel-arrow next" onClick={goToNext}>
                <i className="fas fa-chevron-right"></i>
              </button>
              
              <div className="carousel-dots">
                {activities.map((_, idx) => (
                  <button
                    key={idx}
                    className={`dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Activities;