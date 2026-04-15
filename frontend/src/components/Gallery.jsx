import React from 'react';
import '../styles/Gallery.css';

function Gallery({ gallery, isAdmin, onDelete, onAdd }) {
  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <h2>Gallery</h2>
          <p>Beautiful moments from around the Philippines</p>
          {isAdmin && (
            <button className="add-btn" onClick={onAdd}>
              <i className="fas fa-plus"></i> Add Photo
            </button>
          )}
        </div>

        <div className="gallery-grid">
          {gallery.map((photo, idx) => (
            <div key={idx} className="gallery-item">
              <img src={photo.url} alt={photo.title || 'Gallery photo'} />
              <div className="gallery-overlay">
                <h4>{photo.title}</h4>
                {isAdmin && (
                  <button
                    className="delete-gallery-btn"
                    onClick={() => onDelete(photo.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
