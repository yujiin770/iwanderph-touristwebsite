import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swal from 'sweetalert2';
import { contactService } from '../services/api';
import '../styles/Contact.css';

gsap.registerPlugin(ScrollTrigger);

function Contact({ contactInfo: propContactInfo, isAdmin = false, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [contactInfo, setContactInfo] = useState({
    phone: '+63 917 123 4567',
    email: 'info@iwanderph.com',
    address: 'Manila, Philippines'
  });
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);
  const infoItemsRef = useRef([]);

  const scrollToContactForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fetch contact info if not provided via props
  useEffect(() => {
    if (propContactInfo) {
      setContactInfo(propContactInfo);
    } else {
      fetchContactInfo();
    }
  }, [propContactInfo]);

  const fetchContactInfo = async () => {
    try {
      const res = await contactService.getInfo();
      if (res.data) {
        setContactInfo(res.data);
      }
    } catch (error) {
      console.error('Error fetching contact info');
    }
  };

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

      // Info items stagger animation
      infoItemsRef.current.forEach((item, index) => {
        gsap.fromTo(item,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Form animation
      gsap.fromTo(formRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if terms are agreed
    if (!agreeTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms Required',
        text: 'Please agree to the Terms & Conditions before sending.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    
    setLoading(true);

    try {
      await contactService.sendMessage({
        ...formData,
        website: honeypot,
        formStartedAt,
      });
      setFormData({ name: '', email: '', message: '' });
      setAgreeTerms(false);
      setHoneypot('');
      setFormStartedAt(Date.now());
      await Swal.fire({
        icon: 'success',
        title: 'Message Sent',
        text: 'Your message has been sent successfully. We will get back to you soon.',
        confirmButtonColor: '#2563eb',
      });
    } catch (err) {
      const message = err.message || 'Failed to send message. Please try again.';
      const lowerMessage = message.toLowerCase();
      const alertIcon = lowerMessage.includes('daily') || lowerMessage.includes('wait') || lowerMessage.includes('spam')
        ? 'warning'
        : 'error';
      const alertTitle = lowerMessage.includes('daily')
        ? 'Daily Limit Reached'
        : lowerMessage.includes('wait')
          ? 'Cooldown Active'
          : lowerMessage.includes('spam')
            ? 'Submission Blocked'
            : 'Send Failed';

      await Swal.fire({
        icon: alertIcon,
        title: alertTitle,
        text: message,
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section-modern" ref={sectionRef}>
      <div className="contact-bg-pattern"></div>
      <div className="container">
        <div className="contact-header" ref={headerRef}>
          <span className="contact-badge">GET IN TOUCH</span>
          <h2>Let's Start a Conversation</h2>
          <div className="contact-divider">
            <span></span>
            <i className="fas fa-comment-dots"></i>
            <span></span>
          </div>
          <p>Have questions about your next adventure? We're here to help!</p>
        </div>

        <div className="contact-content-modern">
          {/* Contact Info Cards */}
          <div className="contact-info-modern">
            <div className="info-card" ref={el => infoItemsRef.current[0] = el}>
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="info-details">
                <h4>Phone Number</h4>
                <p>{contactInfo.phone}</p>
                <span className="info-sub">Available 24/7</span>
              </div>
            </div>
            
            <div className="info-card" ref={el => infoItemsRef.current[1] = el}>
              <div className="info-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="info-details">
                <h4>Email Address</h4>
                <p>{contactInfo.email}</p>
                <span className="info-sub">Reply within 24 hours</span>
              </div>
            </div>
            
            <div className="info-card" ref={el => infoItemsRef.current[2] = el}>
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-details">
                <h4>Location</h4>
                <p>{contactInfo.address}</p>
                <span className="info-sub">Visit us by appointment</span>
              </div>
            </div>

            <div className="support-card" ref={el => infoItemsRef.current[3] = el}>
              <div className="support-card-top">
                <span className="support-card-badge">SMART SUPPORT</span>
                <h4>AI guidance with human follow-up</h4>
                <p>
                  Start with quick travel assistance, then move to customer service for booking,
                  pricing, or itinerary questions.
                </p>
              </div>

              <div className="support-feature-list">
                <span><i className="fas fa-map-signs"></i> Destination matching</span>
                <span><i className="fas fa-wallet"></i> Budget-friendly suggestions</span>
                <span><i className="fas fa-headset"></i> Real support when needed</span>
              </div>

              <div className="support-card-actions">
                <button type="button" className="support-card-btn primary" onClick={scrollToContactForm}>
                  Ask for Help
                </button>
                <a href={`mailto:${contactInfo.email}`} className="support-card-btn secondary">
                  Email Support
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form-modern" ref={formRef} onSubmit={handleSubmit}>
            <div className="contact-honeypot" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>We'd love to hear from you</p>
            </div>
            
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <i className="fas fa-user"></i>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="fas fa-envelope"></i>
            </div>

            <div className="input-group">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <i className="fas fa-pencil-alt"></i>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="terms-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="terms-text">
                  I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and 
                  <a href="/privacy" target="_blank"> Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="submit-btn-modern" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Sending...
                </>
              ) : (
                <>
                  Send Message <i className="fas fa-paper-plane"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
