import React from 'react';
import '../styles/DestinationCard.css';

function DestinationCard({ destination, onEdit, onDelete, isAdmin, onClick }) {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && typeof onEdit === 'function') {
      onEdit(destination);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && typeof onDelete === 'function') {
      onDelete(destination.id);
    }
  };

  const handleCardClick = () => {
    if (onClick && typeof onClick === 'function') {
      onClick(destination);
    }
  };

  return (
    <div className="destination-card-modern" onClick={handleCardClick}>
      <div className="destination-card-image">
        <img src={destination.image} alt={destination.name} />
        <div className="destination-card-overlay"></div>
        <div className="destination-card-rating">
          <i className="fas fa-star"></i>
          <span>{destination.rating || '4.5'}</span>
        </div>
      </div>
      <div className="destination-card-content">
        <h3>{destination.name}</h3>
        <p className="destination-card-label">{destination.label}</p>
        <div className="destination-card-footer">
          <button className="explore-more-btn">
            View Details <i className="fas fa-arrow-right"></i>
          </button>
          {isAdmin && (
            <div className="destination-card-actions">
              <button className="edit-btn" onClick={handleEdit}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="delete-btn" onClick={handleDelete}>
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