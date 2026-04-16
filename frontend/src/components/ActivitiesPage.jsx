import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ActivitiesPage.css';

function ActivitiesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const activities = [
    {
      id: 1,
      title: "HANGIN TULAY OCTOPUS ADVENTURE",
      location: "Bohol",
      region: "Visayas",
      category: "Adventure",
      duration: "3-4 hours",
      difficulty: "Moderate",
      price: "₱1,500",
      rating: 4.8,
      description: "Experience the thrilling octopus-shaped hanging bridge with stunning ocean views and adventure activities.",
      image: "https://images.pexels.com/photos/1068780/pexels-photo-1068780.jpeg",
      highlights: ["Suspension Bridge", "Ocean Views", "Group Activity"]
    },
    {
      id: 2,
      title: "GET PANORAMIC VIEWS OF PLACER",
      location: "Placer",
      region: "Visayas",
      category: "Sightseeing",
      duration: "2-3 hours",
      difficulty: "Easy",
      price: "₱800",
      rating: 4.6,
      description: "Capture breathtaking panoramic views of Placer's beautiful landscape from the highest viewpoint.",
      image: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg",
      highlights: ["Panoramic Views", "Photo Spots", "Nature Walk"]
    },
    {
      id: 3,
      title: "SPELUNKING AT CUYAPNIT CAVE",
      location: "Cuyapnit",
      region: "Luzon",
      category: "Adventure",
      duration: "4-5 hours",
      difficulty: "Challenging",
      price: "₱2,000",
      rating: 4.9,
      description: "Discover the hidden wonders of Cuyapnit Cave with expert guides and explore underground formations.",
      image: "https://images.pexels.com/photos/1266339/pexels-photo-1266339.jpeg",
      highlights: ["Cave Exploration", "Underground Rivers", "Stalactites"]
    },
    {
      id: 4,
      title: "ISLAND HOPPING ADVENTURE",
      location: "Palawan",
      region: "Luzon",
      category: "Water Sports",
      duration: "6-8 hours",
      difficulty: "Easy",
      price: "₱2,500",
      rating: 4.9,
      description: "Explore multiple islands, lagoons, and hidden beaches in one unforgettable day trip.",
      image: "https://images.pexels.com/photos/2340973/pexels-photo-2340973.jpeg",
      highlights: ["Multiple Islands", "Snorkeling", "Beach Lunch"]
    },
    {
      id: 5,
      title: "WATERFALL TREKKING",
      location: "Cebu",
      region: "Visayas",
      category: "Nature",
      duration: "3-4 hours",
      difficulty: "Moderate",
      price: "₱1,200",
      rating: 4.7,
      description: "Hike through lush jungles to discover stunning waterfalls and natural pools.",
      image: "https://images.pexels.com/photos/1386925/pexels-photo-1386925.jpeg",
      highlights: ["Jungle Trek", "Swimming", "Photography"]
    },
    {
      id: 6,
      title: "DIVING AT TURTLE BAY",
      location: "Davao",
      region: "Mindanao",
      category: "Water Sports",
      duration: "4-5 hours",
      difficulty: "Moderate",
      price: "₱3,000",
      rating: 4.9,
      description: "Experience world-class diving with sea turtles and vibrant coral reefs.",
      image: "https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg",
      highlights: ["Sea Turtles", "Coral Reefs", "Marine Life"]
    },
    {
      id: 7,
      title: "VOLCANO HIKING",
      location: "Albay",
      region: "Luzon",
      category: "Adventure",
      duration: "8-10 hours",
      difficulty: "Challenging",
      price: "₱3,500",
      rating: 4.8,
      description: "Conquer the iconic Mayon Volcano with experienced local guides.",
      image: "https://images.pexels.com/photos/2085739/pexels-photo-2085739.jpeg",
      highlights: ["Volcano Views", "Sunrise Summit", "Local Guides"]
    },
    {
      id: 8,
      title: "RIVER KAYAKING",
      location: "Palawan",
      region: "Luzon",
      category: "Water Sports",
      duration: "2-3 hours",
      difficulty: "Easy",
      price: "₱900",
      rating: 4.5,
      description: "Paddle through crystal clear waters surrounded by limestone cliffs.",
      image: "https://images.pexels.com/photos/1598991/pexels-photo-1598991.jpeg",
      highlights: ["Kayaking", "Limestone Cliffs", "Wildlife Spotting"]
    }
  ];

  // Filter activities based on search and region
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || activity.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Sort activities
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return parseInt(a.price.replace('₱', '')) - parseInt(b.price.replace('₱', ''));
    return 0;
  });

  return (
    <div className="activities-page">
      <div className="activities-page-container">
        {/* Header */}
        <div className="activities-page-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <h1>EXPLORE ACTIVITIES</h1>
          <p>Experience a safe and fun-filled holiday across 7,641 islands</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Enter a Location or Activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="region-filters">
            <h3>REGION / PROVINCE</h3>
            <div className="region-buttons">
              <button 
                className={selectedRegion === 'all' ? 'active' : ''}
                onClick={() => setSelectedRegion('all')}
              >
                All Regions
              </button>
              <button 
                className={selectedRegion === 'Luzon' ? 'active' : ''}
                onClick={() => setSelectedRegion('Luzon')}
              >
                Luzon
              </button>
              <button 
                className={selectedRegion === 'Visayas' ? 'active' : ''}
                onClick={() => setSelectedRegion('Visayas')}
              >
                Visayas
              </button>
              <button 
                className={selectedRegion === 'Mindanao' ? 'active' : ''}
                onClick={() => setSelectedRegion('Mindanao')}
              >
                Mindanao
              </button>
            </div>
          </div>

          <div className="sort-section">
            <label>Sort By:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Found {sortedActivities.length} activities
        </div>

        {/* Activities Grid */}
        <div className="activities-grid-page">
          {sortedActivities.map((activity) => (
            <div key={activity.id} className="activity-card-page">
              <div className="activity-image-page">
                <img src={activity.image} alt={activity.title} />
                <div className="activity-badge">{activity.category}</div>
              </div>
              <div className="activity-info-page">
                <h3>{activity.title}</h3>
                <div className="activity-location">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{activity.location}, {activity.region}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-details">
                  <span><i className="far fa-clock"></i> {activity.duration}</span>
                  <span><i className="fas fa-chart-line"></i> {activity.difficulty}</span>
                  <span className="rating"><i className="fas fa-star"></i> {activity.rating}</span>
                </div>
                <div className="activity-highlights">
                  {activity.highlights.map((highlight, idx) => (
                    <span key={idx} className="highlight-tag">{highlight}</span>
                  ))}
                </div>
                <div className="activity-footer">
                  <span className="price">{activity.price}</span>
                  <button className="book-now-btn">Book Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedActivities.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No activities found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivitiesPage;