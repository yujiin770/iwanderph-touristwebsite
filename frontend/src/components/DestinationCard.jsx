import React from 'react';
import '../styles/DestinationCard.css';

function DestinationCard({ destination, onEdit, onDelete, isAdmin }) {
  return (
    <div className="destination-card">
      <div className="destination-image">
        <img src={destination.image} alt={destination.name} />
      </div>
      <div className="destination-content">
        <h3>{destination.name}</h3>
        <p className="destination-label">{destination.label}</p>
        <p className="destination-description">{destination.description}</p>
        <div className="destination-footer">
          <span className="rating">
            <i className="fas fa-star"></i> {destination.rating || '4.5'}
          </span>
          {isAdmin && (
            <div className="destination-actions">
              <button className="edit-btn" onClick={() => onEdit(destination)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="delete-btn" onClick={() => onDelete(destination.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;
