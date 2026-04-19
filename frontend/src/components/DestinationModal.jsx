import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/DestinationModal.css';

function DestinationModal({ destination, onClose }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // GSAP entrance animation
    gsap.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    
    gsap.fromTo(contentRef.current,
      { scale: 0.9, y: 50, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(0.8)" }
    );

    gsap.fromTo(imageRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2 }
    );

    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };
  const formatActivities = (activities) => {
    if (!activities) return 'Sightseeing, Photography';
    if (Array.isArray(activities)) return activities.join(', ');
    return activities;
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleBackdropClick}>
      <div className="modal-container" ref={contentRef}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-image" ref={imageRef}>
          <img src={destination.image} alt={destination.name} />
          <div className="modal-rating">
            <i className="fas fa-star"></i>
            <span>{destination.rating || '4.5'}</span>
          </div>
        </div>
        
        <div className="modal-content">
          <div className="modal-header">
            <h2>{destination.name}</h2>
            <span className="modal-label">{destination.label}</span>
          </div>
          
          <div className="modal-description">
            <h3>About This Destination</h3>
            <p>{destination.description}</p>
          </div>
          
          <div className="modal-features">
            <div className="feature-item">
              <i className="fas fa-calendar-alt"></i>
              <span>Best Time to Visit</span>
              <p>{destination.best_time || 'November - May'}</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Location</span>
              <p>{destination.label || 'Philippines'}</p>
            </div>
            <div className="feature-item">
              <i className="fas fa-heart"></i>
              <span>Activities</span>
              <p>{formatActivities(destination.activities)}</p>
            </div>
          </div>
          
          <button className="modal-book-btn" onClick={onClose}>
            Plan Your Visit <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DestinationModal;