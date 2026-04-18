import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/MainFooter.css';

gsap.registerPlugin(ScrollTrigger);

function MainFooter() {
    const footerRef = useRef(null);
    const logoRef = useRef(null);
    const socialRef = useRef(null);
    const copyrightRef = useRef(null);

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Logo animation - triggers when footer comes into view
            gsap.fromTo(logoRef.current,
                { scale: 0.8, opacity: 0, y: 30 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(0.8)",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Social icons stagger animation
            const socialIcons = document.querySelectorAll('.social-icon');
            gsap.fromTo(socialIcons,
                { scale: 0, opacity: 0, rotation: -180 },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(0.8)",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Copyright animation
            gsap.fromTo(copyrightRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.3,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer className="main-footer" ref={footerRef}> 
            <div className="footer-bg-pattern"></div>
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Logo Section */}
                    <div className="footer-logo-section" ref={logoRef}>
                        <div className="footer-logo">
                            <i className="fas fa-sun"></i>
                            <h2>iWander PH</h2>
                        </div>
                        <p className="footer-tagline">Explore the beauty of the Philippines</p>
                        <p className="footer-description">Your trusted travel partner for unforgettable adventures across 7,641 islands.</p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links-column">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><button onClick={() => scrollToSection('home')}>Home</button></li>
                            <li><button onClick={() => scrollToSection('destinations')}>Destinations</button></li>
                            <li><button onClick={() => scrollToSection('gallery')}>Gallery</button></li>
                            <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-links-column">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Cancellation Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="footer-newsletter">
                        <h3>Stay Updated</h3>
                        <p>Subscribe to get the latest travel tips and offers</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-copyright" ref={copyrightRef}>
                        <p>&copy; 2026 iWander Philippines. All rights reserved.</p>
                    </div>
                    <div className="footer-social" ref={socialRef}>
                        <a href="#" className="social-icon" aria-label="Facebook">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="social-icon" aria-label="X (Twitter)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default MainFooter;