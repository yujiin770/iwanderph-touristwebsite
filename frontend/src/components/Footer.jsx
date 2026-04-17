import React from 'react';
import '../styles/Footer.css';

function Footer() {
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
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Copyright Section */}
          <div className="footer-copyright">
            <p>© 2026 iWander Philippines. All rights reserved.</p>
          </div>

          {/* Share Section */}
          <div className="footer-share">
            <span className="share-label">SHARE</span>
            <div className="share-icons">
              <button onClick={shareOnFacebook} className="share-btn fb" aria-label="Share on Facebook">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button onClick={shareOnTwitter} className="share-btn twitter" aria-label="Share on Twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button onClick={shareOnLinkedIn} className="share-btn linkedin" aria-label="Share on LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>
          </div>

          {/* Back to Top Button */}
          <button onClick={scrollToTop} className="footer-back-to-top">
            <i className="fas fa-arrow-up"></i>
            <span>BACK TO TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;