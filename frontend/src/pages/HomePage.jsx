import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import Activities from '../components/Activities'; // Import the new component
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import '../styles/HomePage.css';
import { destinationService, galleryService, heroService } from '../services/api';

function HomePage() {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [destRes, galRes, heroRes] = await Promise.all([
        destinationService.getAll(),
        galleryService.getAll(),
        heroService.get(),
      ]);
      setDestinations(destRes.data || []);
      setGallery(galRes.data || []);
      setHeroData(heroRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="home-page">
      <Navigation />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <Hero heroData={heroData} />
          <Destinations
            destinations={destinations}
            isAdmin={!!user}
            onDelete={handleDeleteDestination}
          />
          <Activities /> {/* Add Activities section here */}
          <Gallery
            gallery={gallery}
            isAdmin={!!user}
            onDelete={handleDeleteGallery}
          />
          <Contact />
        </>
      )}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 iWander Philippines. All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
