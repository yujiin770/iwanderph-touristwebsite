import React, { useState, useEffect, useRef } from 'react';
import { activityService } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Activities.css';

gsap.registerPlugin(ScrollTrigger);

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchActivities();
    const checkScreen = () => setIsMobile(window.innerWidth <= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await activityService.getAll();
      setActivities(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // GSAP Animation Logic (Identical to your original)
  useEffect(() => {
    if (loading || activities.length === 0) return;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          gsap.fromTo(card,
            { x: index % 2 === 0 ? -80 : 80, opacity: 0, scale: 0.9 },
            {
              x: 0, opacity: 1, scale: 1, duration: 0.7, delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: { trigger: gridRef.current, start: "top 85%" }
            }
          );
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, activities, isMobile]);

  // Handle expansion for tablets/desktop
  const handleCardClick = (id) => {
    if (isMobile) return;
    if (expandedId === id) {
      setExpandedId(null);
      cardsRef.current.forEach(card => gsap.to(card, { flex: 1, duration: 0.4 }));
    } else {
      setExpandedId(id);
      cardsRef.current.forEach((card, idx) => {
        const targetFlex = activities[idx]?.id === id ? 3 : 1;
        gsap.to(card, { flex: targetFlex, duration: 0.5, ease: "power2.out" });
      });
    }
  };

  if (loading || activities.length === 0) return null;

  return (
    <section className="activities-section" ref={sectionRef}>
      <div className="activities-container">
        <div className="activities-header">
          <span className="pre-title">THINGS TO DO</span>
          <h2>ACTIVITIES</h2>
        </div>

        {!isMobile ? (
          <div className="activities-grid" ref={gridRef}>
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`activity-card ${expandedId === activity.id ? 'expanded' : ''}`}
                ref={el => cardsRef.current[index] = el}
                onClick={() => handleCardClick(activity.id)}
              >
                <div className="activity-image-wrapper">
                  <img src={activity.image} alt={activity.title} />
                  <div className="activity-overlay">
                    <h3>{activity.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Mobile Carousel (Stick to your original layout) */
          <div className="activities-carousel" ref={carouselRef}>
            <div className="carousel-container">
              <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {activities.map((activity) => (
                  <div key={activity.id} className="carousel-slide">
                    <div className="activity-image-wrapper">
                      <img src={activity.image} alt={activity.title} />
                      <div className="activity-overlay"><h3>{activity.title}</h3></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="carousel-arrow prev" onClick={() => setCurrentIndex(prev => (prev - 1 + activities.length) % activities.length)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="carousel-arrow next" onClick={() => setCurrentIndex(prev => (prev + 1) % activities.length)}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Activities;