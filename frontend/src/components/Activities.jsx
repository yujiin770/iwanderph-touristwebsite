import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Activities.css';

// Import your specific images for each activity
import hanginTulayImage from '../assets/SnakeIslandElNido.jpg';
import panoramicImage from '../assets/chocolate-hills.jpg';
import spelunkingImage from '../assets/siargao.jpg';
import islandHoppingImage from '../assets/mayon-volcano.jpg';
import waterfallImage from '../assets/coron.jpg';

gsap.registerPlugin(ScrollTrigger);

function Activities() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // For touch expand
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

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

  // Check screen size for mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header and title animations
      gsap.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(titleRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: "back.out(0.6)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Desktop/Tablet: Cards stagger animation
      if (!isMobile) {
        cardsRef.current.forEach((card, index) => {
          gsap.fromTo(card,
            { 
              x: index % 2 === 0 ? -80 : 80,
              opacity: 0,
              scale: 0.9
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              delay: index * 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }

      // Mobile: Carousel fade in animation
      if (isMobile && carouselRef.current) {
        gsap.fromTo(carouselRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Handle card click for tablet touch devices
  const handleCardClick = (id) => {
    if (isTablet) {
      if (expandedId === id) {
        // Collapse if already expanded
        setExpandedId(null);
        // Reset all cards flex
        cardsRef.current.forEach((card, idx) => {
          if (card) {
            gsap.to(card, {
              flex: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      } else {
        // Expand clicked card
        setExpandedId(id);
        // Animate the cards
        cardsRef.current.forEach((card, idx) => {
          if (card) {
            const targetFlex = activities[idx]?.id === id ? 2.5 : 1;
            gsap.to(card, {
              flex: targetFlex,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
      }
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (isMobile) {
      gsap.fromTo('.carousel-slide',
        { opacity: 0.7, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
    if (isMobile) {
      gsap.fromTo('.carousel-slide',
        { opacity: 0.7, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activities.length);
    if (isMobile) {
      gsap.fromTo('.carousel-slide',
        { opacity: 0.7, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  const handleExploreClick = (activityTitle) => {
    // Store selected activity in localStorage or state if needed
    localStorage.setItem('selectedActivity', activityTitle);
    navigate('/activities');
  };

  return (
    <section className="activities-section" ref={sectionRef}>
      <div className="activities-container">
        <div className="activities-header" ref={headerRef}>
          <span className="pre-title" ref={subtitleRef}>THINGS TO DO</span>
          <h2 ref={titleRef}>ACTIVITIES</h2>
        </div>

        {/* Desktop & Tablet View - Horizontal Expand Grid */}
        {!isMobile && (
          <div className="activities-grid" ref={gridRef}>
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`activity-card ${hoveredId === activity.id ? 'hovered' : ''} ${expandedId === activity.id ? 'expanded' : ''}`}
                ref={el => cardsRef.current[index] = el}
                onMouseEnter={() => !isTablet && setHoveredId(activity.id)}
                onMouseLeave={() => !isTablet && setHoveredId(null)}
                onClick={() => isTablet && handleCardClick(activity.id)}
                style={{ cursor: isTablet ? 'pointer' : 'default' }}
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
                    {/* Split title into lines for better display */}
                    <h3>
                      {activity.title.split(' ').map((word, i) => (
                        <React.Fragment key={i}>
                          {word}
                          {(i + 1) % 3 === 0 && i !== activity.title.split(' ').length - 1 ? <br /> : ' '}
                        </React.Fragment>
                      ))}
                    </h3>
                    <button 
                      className="explore-activity-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExploreClick(activity.title);
                      }}
                    >
                      {activity.buttonText} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile View - Carousel */}
        {isMobile && (
          <div className="activities-carousel" ref={carouselRef}>
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
                          onClick={() => handleExploreClick(activity.title)}
                        >
                          {activity.buttonText} →
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