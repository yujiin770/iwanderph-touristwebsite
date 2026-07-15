import React, { useEffect, useRef, useState } from 'react';
import { brandStoryService } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/BrandStory.css';

gsap.registerPlugin(ScrollTrigger);

function BrandStory() {
    const [content, setContent] = useState({ title: 'Loading...', description: '' });
    const [features, setFeatures] = useState([]);
    
    const sectionRef = useRef(null);
    const logoRef = useRef(null);
    const sunIconRef = useRef(null);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, fRes] = await Promise.all([brandStoryService.getContent(), brandStoryService.getFeatures()]);
                if (cRes.data) setContent(cRes.data);
                setFeatures(fRes.data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (features.length === 0) return; // Wait for data to animate

        const ctx = gsap.context(() => {
            // ... Original Logo & Title Animations ...
            const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 90%" } });
            tl.fromTo(sunIconRef.current, { rotation: 0, scale: 0, opacity: 0, y: -30 }, { rotation: 360, scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)" })
              .fromTo(logoRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4");

            gsap.fromTo(titleRef.current, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 90%" } });
            gsap.fromTo(descRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 90%" } });

            // Dynamic Feature Items stagger animation
            gsap.fromTo('.feature-item', 
                { y: 80, opacity: 0, scale: 0.9 }, 
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(0.8)", scrollTrigger: { trigger: featuresRef.current, start: "top 85%" } }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [features]);

    return (
        <section className="brand-story" ref={sectionRef}>
            <div className="brand-container">
                <div className="brand-logo">
                    <div className="logo-sun-wrapper"><i className="fas fa-sun" ref={sunIconRef}></i></div>
                    <h1 className="brand-logo-text" ref={logoRef}>iWander PH</h1>
                </div>

                <div className="brand-content">
                    <h2 ref={titleRef}>{content.title}</h2>
                    <p ref={descRef}>{content.description}</p>
                </div>

                <div className="features-grid" ref={featuresRef}>
                    {features.map((item) => (
                        <div key={item.id} className="feature-item">
                            <div className="feature-icon"><i className={item.icon}></i></div>
                            <div className="feature-text">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BrandStory;