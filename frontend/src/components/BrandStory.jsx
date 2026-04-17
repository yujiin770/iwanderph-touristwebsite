import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/BrandStory.css';

gsap.registerPlugin(ScrollTrigger);

function BrandStory() {
  const sectionRef = useRef(null);
  const logoRef = useRef(null);
  const sunIconRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo animation - sun icon above iWander
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      
      tl.fromTo(sunIconRef.current,
        { rotation: 0, scale: 0, opacity: 0, y: -30 },
        {
          rotation: 360,
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.2)"
        }
      )
      .fromTo(logoRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        },
        "-=0.4"
      );

      // Title animation
      gsap.fromTo(titleRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Description animation
      gsap.fromTo(descRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Features stagger animation
      const features = document.querySelectorAll('.feature-item');
      gsap.fromTo(features,
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(0.8)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="brand-story" ref={sectionRef}>
      <div className="brand-container">
        <div className="brand-logo">
          <div className="logo-sun-wrapper">
            <i className="fas fa-sun" ref={sunIconRef}></i>
          </div>
         <h1 className="brand-logo-text" ref={logoRef}>iWander PH</h1>
        </div>

        <div className="brand-content">
          <h2 ref={titleRef}>Discover the Pearl of the Orient</h2>
          <p ref={descRef}>
            iWander PH is your ultimate guide to exploring the breathtaking beauty of the Philippines. 
            From pristine white-sand beaches and crystal-clear waters to majestic mountains and vibrant 
            cultural heritage, we help you create unforgettable travel experiences across 7,641 islands.
          </p>
        </div>

        <div className="features-grid" ref={featuresRef}>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-umbrella-beach"></i>
            </div>
            <h3>Pristine Beaches</h3>
            <p>Discover world-famous beaches like Boracay, Palawan, and Siargao</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-mountain"></i>
            </div>
            <h3>Majestic Mountains</h3>
            <p>Hike stunning peaks and witness breathtaking sunrise views</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-fish"></i>
            </div>
            <h3>Marine Life</h3>
            <p>Experience world-class diving and snorkeling in coral reefs</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-landmark"></i>
            </div>
            <h3>Cultural Heritage</h3>
            <p>Explore centuries-old churches, forts, and local traditions</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-water"></i>
            </div>
            <h3>Hidden Waterfalls</h3>
            <p>Swim in stunning waterfalls tucked away in tropical jungles</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <h3>Local Cuisine</h3>
            <p>Savor authentic Filipino dishes and street food delights</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStory;