import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/WhyChooseUs.css';

gsap.registerPlugin(ScrollTrigger);

function WhyChooseUs() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);

    const features = [
        {
            id: 1,
            icon: "fas fa-car",
            title: "Quality Vehicles",
            description: "Well-maintained cars for safe and comfortable journeys"
        },
        {
            id: 2,
            icon: "fas fa-tag",
            title: "Best Price Guarantee",
            description: "Affordable rates with no hidden fees"
        },
        {
            id: 3,
            icon: "fas fa-headset",
            title: "24/7 Support",
            description: "Round-the-clock customer assistance"
        },
        {
            id: 4,
            icon: "fas fa-shield-alt",
            title: "Fully Insured",
            description: "Complete insurance coverage for peace of mind"
        },
        {
            id: 5,
            icon: "fas fa-headset",
            title: "Local Support",
            description: "Friendly local staff ready to assist you 24/7"
        },
        {
            id: 6,
            icon: "fas fa-clock",
            title: "Flexible Rental",
            description: "Hourly, daily, weekly, and monthly options"
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
            gsap.fromTo(titleRef.current,
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

            // Cards stagger animation
            cardsRef.current.forEach((card, index) => {
                gsap.fromTo(card,
                    { y: 60, opacity: 0, scale: 0.95 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="why-choose-us" ref={sectionRef}>
            <div className="why-choose-container">
                <div className="why-choose-header" ref={titleRef}>
                    <span className="why-badge">WHY CHOOSE US</span>
                    <h2>Your Trusted Travel Partner</h2>
                    <div className="why-divider">
                        <span></span>
                        <i className="fas fa-heart"></i>
                        <span></span>
                    </div>
                    <p>Experience the best car rental service in the Philippines</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="feature-card"
                            ref={el => cardsRef.current[index] = el}
                        >
                            <div className="feature-icon">
                                <i className={feature.icon}></i>
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;