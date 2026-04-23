import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationService } from '../services/api';
import DestinationCard from '../components/DestinationCard';
import DestinationModal from '../components/DestinationModal';
import '../styles/DestinationsPage.css';

import chocolateHillsImg from '../assets/chocolate-hills.jpg';
import siargaoImg from '../assets/siargao.jpg';
import mayonVolcanoImg from '../assets/mayon-volcano.jpg';
import coronImg from '../assets/coron.jpg';

function DestinationsPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const bgImages = [
    chocolateHillsImg,
    siargaoImg,
    mayonVolcanoImg,
    coronImg,
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bgImages.length]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationService.getAll();
        setDestinations(res.data || []);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      const haystack = [
        destination.name,
        destination.label,
        destination.description,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchTerm.toLowerCase());
    });

    if (sortBy === 'title') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return filtered;
  }, [destinations, searchTerm, sortBy]);

  const openModal = (destination) => {
    setSelectedDestination(destination);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDestination(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <div className="destinations-page">
      <div className="destinations-page-hero">
        <div className="hero-carousel">
          {bgImages.map((img, idx) => (
            <div
              key={idx}
              className={`hero-carousel-slide ${idx === currentBgIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
        <div className="destinations-page-hero-overlay"></div>
        <div className="destinations-page-hero-content">
          <div className="hero-logo">
            <i className="fas fa-map-marked-alt"></i>
            <h1>iWander PH</h1>
          </div>
          <h2>Our Destinations</h2>
          <p>Browse the must-visit places waiting across the Philippines</p>
          <div className="destinations-page-stats">
            <div className="stat">
              <div className="stat-icon">
                <i className="fas fa-map-pin"></i>
              </div>
              <span className="stat-number">{destinations.length}</span>
              <span className="stat-label">Places</span>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <i className="fas fa-compass"></i>
              </div>
              <span className="stat-number">{filteredDestinations.length}</span>
              <span className="stat-label">Matches</span>
            </div>
          </div>
        </div>
      </div>

      <div className="destinations-page-filters">
        <div className="filters-container">
          <button className="home-nav-btn" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>

          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-box">
            <i className="fas fa-sort"></i>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="title">Sort by Name</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="destinations-page-loader">
          <div className="loader"></div>
          <p>Loading destinations...</p>
        </div>
      ) : filteredDestinations.length > 0 ? (
        <div className="destinations-page-grid">
          {filteredDestinations.map((destination, idx) => (
            <div key={destination.id || idx} className="destinations-page-item">
              <DestinationCard destination={destination} onClick={openModal} />
            </div>
          ))}
        </div>
      ) : (
        <div className="destinations-page-empty">
          <i className="fas fa-map-signs"></i>
          <h3>No destinations found</h3>
          <p>Try a different keyword and explore again.</p>
        </div>
      )}

      {modalOpen && selectedDestination && (
        <DestinationModal destination={selectedDestination} onClose={closeModal} />
      )}
    </div>
  );
}

export default DestinationsPage;
