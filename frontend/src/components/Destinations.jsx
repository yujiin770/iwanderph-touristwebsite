import React from 'react';
import DestinationCard from './DestinationCard';
import '../styles/Destinations.css';

function Destinations({ destinations, isAdmin, onEdit, onDelete, onAdd }) {
  return (
    <section id="destinations" className="destinations-section">
      <div className="container">
        <div className="section-header">
          <h2>Popular Destinations</h2>
          <p>Discover the most beautiful places in the Philippines</p>
          {isAdmin && (
            <button className="add-btn" onClick={onAdd}>
              <i className="fas fa-plus"></i> Add Destination
            </button>
          )}
        </div>

        <div className="destinations-grid">
          {destinations.map(destination => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Destinations;
