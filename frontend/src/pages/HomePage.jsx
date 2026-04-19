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
import '../styles/HomePage.css';
import { destinationService, galleryService, heroService, contactService } from '../services/api';

function HomePage() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    fetchData();
  }, []);

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
    window.scrollTo(0, 0);
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await destinationService.delete(id);
      setDestinations(destinations.filter(d => d.id !== id));
    } catch (error) {
      alert('Error deleting destination');
    }
  };

  const handleDeleteGallery = async (id) => {
    try {
      await galleryService.delete(id);
      setGallery(gallery.filter(g => g.id !== id));
    } catch (error) {
      alert('Error deleting gallery item');
    }
  };

  return (
    <>
      {showLoader && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      <div className="home-page">
        <Navigation />
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div id="home"><Hero heroData={heroData} /></div>
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
          </>
        )}
        <MainFooter />
        <UtilityFooter />
      </div>
    </>
  );
}

export default HomePage;