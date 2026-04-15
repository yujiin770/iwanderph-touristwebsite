import React, { useState, useEffect } from 'react';
import { heroService } from '../../services/api';
import '../../styles/Admin.css';

function HeroAdmin() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await heroService.get();
      if (res.data) {
        setFormData(res.data);
      }
    } catch (error) {
      console.error('Error fetching hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = [];
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        loaded++;
        if (loaded === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      let images = formData.images || [];

      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formDataToSend = new FormData();
          formDataToSend.append('file', file);
          formDataToSend.append('bucket', 'hero');

          const uploadRes = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formDataToSend,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            },
          });

          if (uploadRes.ok) {
            const { url } = await uploadRes.json();
            images.push(url);
          }
        }
      }

      const dataToSave = {
        title: formData.title,
        description: formData.description,
        images: images,
      };

      await heroService.update(dataToSave);
      alert('Hero section updated successfully!');
      fetchHero();
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      alert('Error updating hero section');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  return (
    <div className="admin-section">
      <h2>🎯 Edit Hero Section</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Main Title</label>
            <textarea
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Explore The Islands of The Philippines"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Discover the stunning beaches..."
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>🖼️ Carousel Images (Upload Multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="file-input"
            />
          </div>

          <div className="carousel-preview">
            <h4>Current Carousel Images:</h4>
            {(formData.images || []).length === 0 ? (
              <p>No images yet</p>
            ) : (
              <div className="carousel-images-grid">
                {(formData.images || []).map((img, idx) => (
                  <div key={idx} className="carousel-image-item">
                    <img src={img} alt={`Carousel ${idx + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="delete-btn-small"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length > 0 && (
              <>
                <h4>New Images to Upload:</h4>
                <div className="carousel-images-grid">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="carousel-image-item">
                      <img src={preview} alt={`New ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? '⏳ Uploading...' : '💾 Update Hero Section'}
          </button>
        </form>
      )}
    </div>
  );
}

export default HeroAdmin;
