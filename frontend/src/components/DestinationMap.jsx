import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DestinationModal from './DestinationModal';
import 'leaflet/dist/leaflet.css';
import '../styles/DestinationMap.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#3b82f6') => {
  return L.divIcon({
    html: `<div class="custom-marker" style="background: ${color};">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
           </div>`,
    className: 'custom-marker-div',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });
};

// Component to animate map view
const AnimateMapView = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

// Expanded destination coordinates for Philippines
// This covers major cities and tourist spots
const getDestinationCoordinates = (name) => {
  const coordsMap = {
    // Luzon
    'Manila': { lat: 14.5995, lng: 120.9842, region: 'Luzon', color: '#3b82f6' },
    'Baguio': { lat: 16.4023, lng: 120.5960, region: 'Luzon', color: '#3b82f6' },
    'Vigan': { lat: 17.5749, lng: 120.3869, region: 'Luzon', color: '#3b82f6' },
    'Banaue': { lat: 16.9199, lng: 121.0580, region: 'Luzon', color: '#3b82f6' },
    'Palawan': { lat: 10.1339, lng: 118.9330, region: 'Luzon', color: '#3b82f6' },
    'Puerto Princesa': { lat: 9.7397, lng: 118.7353, region: 'Luzon', color: '#3b82f6' },
    'El Nido': { lat: 11.1958, lng: 119.4071, region: 'Luzon', color: '#3b82f6' },
    'Coron': { lat: 12.0000, lng: 120.2000, region: 'Luzon', color: '#3b82f6' },
    'Mayon Volcano': { lat: 13.2544, lng: 123.6854, region: 'Luzon', color: '#3b82f6' },
    'Legazpi': { lat: 13.1395, lng: 123.7430, region: 'Luzon', color: '#3b82f6' },
    'Tagaytay': { lat: 14.1000, lng: 120.9333, region: 'Luzon', color: '#3b82f6' },
    'Subic': { lat: 14.8833, lng: 120.2333, region: 'Luzon', color: '#3b82f6' },
    'Olongapo': { lat: 14.8292, lng: 120.2825, region: 'Luzon', color: '#3b82f6' },
    'Batangas': { lat: 13.7565, lng: 121.0583, region: 'Luzon', color: '#3b82f6' },
    'La Union': { lat: 16.6150, lng: 120.3194, region: 'Luzon', color: '#3b82f6' },
    'Nueva Vizcaya': { lat: 16.4833, lng: 121.2167, region: 'Luzon', color: '#3b82f6' },
    
    // Visayas
    'Boracay': { lat: 11.9674, lng: 121.9247, region: 'Visayas', color: '#10b981' },
    'Boracay Island': { lat: 11.9674, lng: 121.9247, region: 'Visayas', color: '#10b981' },
    'Cebu': { lat: 10.3157, lng: 123.8854, region: 'Visayas', color: '#10b981' },
    'Cebu City': { lat: 10.3157, lng: 123.8854, region: 'Visayas', color: '#10b981' },
    'Bohol': { lat: 9.8499, lng: 124.1435, region: 'Visayas', color: '#10b981' },
    'Chocolate Hills': { lat: 9.8167, lng: 124.1333, region: 'Visayas', color: '#10b981' },
    'Iloilo': { lat: 10.7202, lng: 122.5621, region: 'Visayas', color: '#10b981' },
    'Iloilo City': { lat: 10.7202, lng: 122.5621, region: 'Visayas', color: '#10b981' },
    'Negros': { lat: 10.5000, lng: 123.0000, region: 'Visayas', color: '#10b981' },
    'Bacolod': { lat: 10.6670, lng: 122.9500, region: 'Visayas', color: '#10b981' },
    'Dumaguete': { lat: 9.3167, lng: 123.3000, region: 'Visayas', color: '#10b981' },
    'Leyte': { lat: 11.0000, lng: 124.8500, region: 'Visayas', color: '#10b981' },
    'Tacloban': { lat: 11.2444, lng: 125.0039, region: 'Visayas', color: '#10b981' },
    'Samar': { lat: 12.0000, lng: 125.0000, region: 'Visayas', color: '#10b981' },
    'Siquijor': { lat: 9.2000, lng: 123.5000, region: 'Visayas', color: '#10b981' },
    
    // Mindanao
    'Siargao': { lat: 9.8621, lng: 126.0464, region: 'Mindanao', color: '#f59e0b' },
    'Siargao Island': { lat: 9.8621, lng: 126.0464, region: 'Mindanao', color: '#f59e0b' },
    'Davao': { lat: 7.1907, lng: 125.4553, region: 'Mindanao', color: '#f59e0b' },
    'Davao City': { lat: 7.1907, lng: 125.4553, region: 'Mindanao', color: '#f59e0b' },
    'Zamboanga': { lat: 6.9214, lng: 122.0790, region: 'Mindanao', color: '#f59e0b' },
    'Zamboanga City': { lat: 6.9214, lng: 122.0790, region: 'Mindanao', color: '#f59e0b' },
    'Cagayan de Oro': { lat: 8.4542, lng: 124.6319, region: 'Mindanao', color: '#f59e0b' },
    'General Santos': { lat: 6.1164, lng: 125.1716, region: 'Mindanao', color: '#f59e0b' },
    'Butuan': { lat: 8.9475, lng: 125.5406, region: 'Mindanao', color: '#f59e0b' },
    'Cotabato': { lat: 7.2000, lng: 124.2500, region: 'Mindanao', color: '#f59e0b' },
    'Surigao': { lat: 9.7833, lng: 125.4833, region: 'Mindanao', color: '#f59e0b' },
    'Camiguin': { lat: 9.1667, lng: 124.7167, region: 'Mindanao', color: '#f59e0b' },
    'Bukidnon': { lat: 8.0000, lng: 125.0000, region: 'Mindanao', color: '#f59e0b' },
  };
  
  // Try exact match first
  if (coordsMap[name]) {
    return coordsMap[name];
  }
  
  // Try case-insensitive partial match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(coordsMap)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return value;
    }
  }
  
  // Default fallback - center of Philippines
  return null;
};

function DestinationMap({ destinations }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const mapWrapperRef = useRef(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 12.8797, lng: 121.7740 });
  const [mapZoom, setMapZoom] = useState(6);
  const [activeFilter, setActiveFilter] = useState('all');

  // Regions filter
  const regions = ['all', 'Luzon', 'Visayas', 'Mindanao'];
  
  // Filter destinations by region and get coordinates
  const mapDestinations = destinations.filter(dest => {
    const coords = getDestinationCoordinates(dest.name);
    if (!coords) return false;
    if (activeFilter === 'all') return true;
    return coords.region === activeFilter;
  });

  // GSAP Animations
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

      // Map wrapper animation
      gsap.fromTo(mapWrapperRef.current,
        { scale: 0.95, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "back.out(0.6)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMarkerClick = (destination) => {
    setSelectedDestination(destination);
    const coords = getDestinationCoordinates(destination.name);
    if (coords) {
      setMapCenter(coords);
      setMapZoom(12);
    }
    
    // Animate marker on click
    gsap.to('.custom-marker', {
      scale: 1.3,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDestination(null);
  };

  const handleViewDetailsClick = (destination) => {
    setSelectedDestination(destination);
    setModalOpen(true);
  };

  const handleRegionFilter = (region) => {
    setActiveFilter(region);
    setMapCenter({ lat: 12.8797, lng: 121.7740 });
    setMapZoom(6);
    setSelectedDestination(null);
    setModalOpen(false);
  };

  return (
    <section className="destination-map-section" ref={sectionRef}>
      <div className="map-bg-pattern"></div>
      <div className="container">
        <div className="map-header" ref={headerRef}>
          <span className="map-badge">EXPLORE</span>
          <h2>Destinations Map</h2>
          <div className="map-divider">
            <span></span>
            <i className="fas fa-map-marked-alt"></i>
            <span></span>
          </div>
          <p>Discover the best destinations across the Philippine archipelago</p>
        </div>

        {/* Region Filters */}
        <div className="map-filters">
          {regions.map(region => (
            <button
              key={region}
              className={`filter-btn ${activeFilter === region ? 'active' : ''}`}
              onClick={() => handleRegionFilter(region)}
            >
              {region === 'all' ? 'All Islands' : region}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="map-wrapper" ref={mapWrapperRef}>
          {mapDestinations.length > 0 ? (
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={mapZoom}
              style={{ height: '500px', width: '100%', borderRadius: '20px' }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              
              <AnimateMapView center={[mapCenter.lat, mapCenter.lng]} zoom={mapZoom} />
              
              {mapDestinations.map((dest, idx) => {
                const coords = getDestinationCoordinates(dest.name);
                if (!coords) return null;
                
                return (
                  <Marker
                    key={dest.id || idx}
                    position={[coords.lat, coords.lng]}
                    icon={createCustomIcon(coords.color)}
                    eventHandlers={{
                      click: () => handleMarkerClick(dest),
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="map-popup-content">
                        <img 
                          src={dest.image} 
                          alt={dest.name}
                          onError={(e) => {
                            e.target.src = 'https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg';
                          }}
                        />
                        <div className="popup-info">
                          <h4>{dest.name}</h4>
                          <p>{dest.label || coords.region}</p>
                          <div className="popup-rating">
                            <i className="fas fa-star"></i>
                            <span>{dest.rating || '4.5'}</span>
                          </div>
                          <button 
                            className="popup-btn"
                            onClick={() => handleViewDetailsClick(dest)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt"></i>
              <p>Loading destinations map...</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-title">
            <i className="fas fa-layer-group"></i>
            <span>Regions</span>
          </div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#3b82f6' }}></div>
              <span>Luzon</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#10b981' }}></div>
              <span>Visayas</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#f59e0b' }}></div>
              <span>Mindanao</span>
            </div>
          </div>
          <div className="legend-stats">
            <i className="fas fa-map-pin"></i>
            <span>{mapDestinations.length} Destinations Shown</span>
          </div>
        </div>
      </div>

      {modalOpen && selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}

export default DestinationMap;
