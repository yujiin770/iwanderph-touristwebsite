import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Gallery.css';

gsap.registerPlugin(ScrollTrigger);

function Gallery({ gallery, isAdmin, onDelete, onAdd }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const itemsRef = useRef([]);

  // Show only first 6 images on homepage
  const displayGallery = gallery.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { y: 50, opacity: 0 },
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

      // Gallery items stagger animation
      itemsRef.current.forEach((item, index) => {
        gsap.fromTo(item,
          { scale: 0.8, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(0.6)",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayGallery]);

  const openModal = (photo) => {
    setSelectedImage(photo);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';

    // GSAP modal animation
    gsap.fromTo('.gallery-modal-content',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(0.8)" }
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  return (
    <>
      <section className="gallery-section" ref={sectionRef}>
        <div className="gallery-bg-pattern"></div>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <span className="section-badge">MEMORIES</span>
            <h2>Gallery</h2>
            <div className="section-divider">
              <span></span>
              <i className="fas fa-camera"></i>
              <span></span>
            </div>
            <p>Beautiful moments from around the Philippines</p>

            <div className="button-group">
              {gallery.length > 6 && (
                <button className="view-all-btn" onClick={() => navigate('/gallery')}>
                  View All Photos <i className="fas fa-arrow-right"></i>
                </button>
              )}

              {isAdmin && (
                <button className="add-btn" onClick={onAdd}>
                  <i className="fas fa-plus"></i> Add Photo
                </button>
              )}
            </div>
          </div>

          <div className="gallery-grid" ref={gridRef}>
            {displayGallery.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="gallery-item"
                ref={el => itemsRef.current[idx] = el}
                onClick={() => openModal(photo)}
              >
                <div className="gallery-image-wrapper">
                  <img src={photo.url} alt={photo.title || 'Gallery photo'} loading="lazy" />
                  <div className="gallery-overlay">
                    <div className="gallery-overlay-content">
                      <i className="fas fa-search-plus"></i>
                      <h4>{photo.title}</h4>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    className="delete-gallery-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(photo.id);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {modalOpen && selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImage.url} alt={selectedImage.title} />
            {selectedImage.title && (
              <div className="modal-caption">
                <h3>{selectedImage.title}</h3>
              </div>
            )}
            <div className="modal-nav">
              <button className="modal-prev" onClick={() => {
                const currentIndex = gallery.findIndex(p => p.id === selectedImage.id);
                const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
                setSelectedImage(gallery[prevIndex]);
              }}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="modal-next" onClick={() => {
                const currentIndex = gallery.findIndex(p => p.id === selectedImage.id);
                const nextIndex = (currentIndex + 1) % gallery.length;
                setSelectedImage(gallery[nextIndex]);
              }}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gallery;