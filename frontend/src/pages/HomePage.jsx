import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import BrandStory from '../components/BrandStory';
import Destinations from '../components/Destinations';
import Activities from '../components/Activities';
import Gallery from '../components/Gallery';
import WhyChooseUs from '../components/WhyChooseUs';
import DestinationMap from '../components/DestinationMap';
import Contact from '../components/Contact';
import MainFooter from '../components/MainFooter';
import UtilityFooter from '../components/UtilityFooter';
import LoadingScreen from '../components/LoadingScreen';
import SupportWidget from '../components/SupportWidget';
import '../styles/HomePage.css';

// Import GSAP and ScrollTrigger to fix mobile visibility issues
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { destinationService, galleryService, heroService, contactService } from '../services/api';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function HomePage() {
  const { user } = useAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Prevent browser from trying to maintain scroll position on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    fetchData();
  }, []);

  // Critical: Recalculate ScrollTrigger positions whenever data changes or loader is removed
  useEffect(() => {
    if (!loading && !showLoader) {
      // Small delay ensures DOM elements are rendered before calculating height
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, showLoader, destinations, gallery]);

  const fetchData = async () => {
    try {
      const [destRes, galRes, heroRes, contactRes] = await Promise.all([
        destinationService.getAll(),
        galleryService.getAll(),
        heroService.get(),
        contactService.getInfo(),
      ]);
      setDestinations(destRes.data || []);
      setGallery(galRes.data || []);
      setHeroData(heroRes.data);
      setContactInfo(contactRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoader(false);
    
    // Ensure body is scrollable
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    
    // Reset to top and refresh GSAP
    window.scrollTo(0, 0);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await destinationService.delete(id);
      setDestinations(destinations.filter(d => d.id !== id));
      // Refresh scroll positions as page height might change
      setTimeout(() => ScrollTrigger.refresh(), 300);
    } catch (error) {
      alert('Error deleting destination');
    }
  };

  const handleDeleteGallery = async (id) => {
    try {
      await galleryService.delete(id);
      setGallery(gallery.filter(g => g.id !== id));
      // Refresh scroll positions
      setTimeout(() => ScrollTrigger.refresh(), 300);
    } catch (error) {
      alert('Error deleting gallery item');
    }
  };

  return (
    <>
      {showLoader && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      <div className={`home-page ${showLoader ? 'hidden-content' : 'visible-content'}`}>
        <Navigation />
        
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Loading Philippines...</p>
          </div>
        ) : (
          <>
            <div id="home"><Hero heroData={heroData} /></div>
            
            {/* Wrap sections in a div to ensure proper height detection */}
            <div className="content-wrapper">
              <BrandStory />
              
              <div id="destinations">
                <Destinations
                  destinations={destinations}
                  isAdmin={!!user}
                  onDelete={handleDeleteDestination}
                />
              </div>

              <DestinationMap destinations={destinations} />
              
              <Activities />
              
              <div id="gallery">
                <Gallery
                  gallery={gallery}
                  isAdmin={!!user}
                  onDelete={handleDeleteGallery}
                />
              </div>
              
              <WhyChooseUs />
              
              <div id="contact">
                <Contact contactInfo={contactInfo} isAdmin={!!user} />
              </div>
            </div>
          </>
        )}
        
        <MainFooter />
        
        <UtilityFooter
          onSupportClick={() => setIsSupportOpen((prev) => !prev)}
          isSupportOpen={isSupportOpen}
        />
        
        {!loading && (
          <SupportWidget
            isOpen={isSupportOpen}
            onToggle={setIsSupportOpen}
            showFloatingButton
          />
        )}
      </div>
    </>
  );
}

export default HomePage;