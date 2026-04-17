import React, { useState, useEffect } from 'react';
import '../styles/UtilityFooter.css';

function UtilityFooter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate how far from bottom (in pixels)
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      
      // Show utility footer only when:
      // 1. Scrolled more than 300px down
      // 2. Not within 200px of the bottom (so it doesn't overlap main footer)
      // 3. Also check if main footer exists and is visible
      const mainFooter = document.querySelector('.footer');
      let isMainFooterVisible = false;
      
      if (mainFooter) {
        const footerRect = mainFooter.getBoundingClientRect();
        isMainFooterVisible = footerRect.top < windowHeight && footerRect.bottom > 0;
      }
      
      if (scrollY > 300 && distanceFromBottom > 200 && !isMainFooterVisible) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', toggleVisibility); // Also trigger on resize
    toggleVisibility(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const shareOnFacebook = () => {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
  };

  const shareOnTwitter = () => {
    window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=Check%20out%20iWander%20PH!', '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href), '_blank');
  };

  return (
    <>
      {isVisible && (
        <div className="utility-footer">
          <div className="utility-container">
            <div className="utility-share">
              <span className="utility-share-label">SHARE</span>
              <div className="utility-share-icons">
                <button onClick={shareOnFacebook} className="utility-share-btn fb">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button onClick={shareOnTwitter} className="utility-share-btn twitter">
                  <i className="fab fa-instagram"></i>
                </button>
                <button onClick={shareOnLinkedIn} className="utility-share-btn linkedin">    
                  <i className="fab fa-twitter"></i>
                </button>
              </div>
            </div>
            <button onClick={scrollToTop} className="utility-back-to-top">
              <i className="fas fa-arrow-up"></i>
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UtilityFooter;