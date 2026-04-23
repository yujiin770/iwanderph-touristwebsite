import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DestinationCard from './DestinationCard';
import DestinationModal from './DestinationModal';
import '../styles/Destinations.css';

gsap.registerPlugin(ScrollTrigger);

function Destinations({ destinations, isAdmin, onEdit, onDelete, onAdd }) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const displayDestinations = destinations.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(sectionRef.current, {
            backgroundPosition: `${self.progress * 100}% 0`
          });
        }
      });

      gsap.fromTo(headerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { 
            y: 100, 
            opacity: 0, 
            rotationX: 45,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            scale: 1,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      cardsRef.current.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -15,
            duration: 0.3,
            ease: "power2.out",
            boxShadow: "0 30px 50px rgba(59,130,246,0.2)"
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.in",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [displayDestinations]);

  const handleCardClick = (destination) => {
    setSelectedDestination(destination);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDestination(null);
  };

  return (
    <>
      <section className="destinations-section" ref={sectionRef}>
        <div className="destinations-bg-pattern"></div>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <span className="section-badge">EXPLORE</span>
            <h2>Popular Destinations</h2>
            <div className="section-divider">
              <span></span>
              <i className="fas fa-map-marker-alt"></i>
              <span></span>
            </div>
            <p>Discover the most breathtaking places in the Philippines</p>
            <div className="button-group">
              {destinations.length > 6 && (
                <button className="view-all-btn" onClick={() => navigate('/destinations')}>
                  View All Destinations <i className="fas fa-arrow-right"></i>
                </button>
              )}

              {isAdmin && (
                <button className="add-btn" onClick={onAdd}>
                  <i className="fas fa-plus"></i> Add Destination
                </button>
              )}
            </div>
          </div>

          <div className="destinations-grid" ref={gridRef}>
            {displayDestinations.map((destination, index) => (
              <div 
                key={destination.id} 
                className="destination-card-wrapper"
                ref={el => cardsRef.current[index] = el}
              >
                <DestinationCard
                  destination={destination}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                  onClick={handleCardClick}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && selectedDestination && (
        <DestinationModal 
          destination={selectedDestination} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}

export default Destinations;
