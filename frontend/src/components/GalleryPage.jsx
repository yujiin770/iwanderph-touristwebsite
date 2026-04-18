import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryService } from '../services/api';
import '../styles/GalleryPage.css';

function GalleryPage() {
    const navigate = useNavigate();
    const [gallery, setGallery] = useState([]);
    const [filteredGallery, setFilteredGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    const imagesPerPage = 20;

    // Local carousel background images
    const bgImages = [
        '/src/assets/chocolate-hills.jpg',
        '/src/assets/chocolate-hills.jpg',
        '/src/assets/siargao.jpg',
        '/src/assets/mayon-volcano.jpg',
        '/src/assets/coron.jpg'
    ];
    // SCROLL TO TOP WHEN PAGE LOADS - ADD THIS
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchGallery();
    }, []);

    // Carousel effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    useEffect(() => {
        fetchGallery();
    }, []);

    // Carousel effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [bgImages.length]);

    useEffect(() => {
        let filtered = [...gallery];

        if (searchTerm) {
            filtered = filtered.filter(img =>
                img.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else if (sortBy === 'title') {
            filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        setFilteredGallery(filtered);
        setCurrentPage(1);
    }, [searchTerm, sortBy, gallery]);

    const fetchGallery = async () => {
        try {
            const res = await galleryService.getAll();
            setGallery(res.data || []);
            setFilteredGallery(res.data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };

    const indexOfLastImage = currentPage * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = filteredGallery.slice(indexOfFirstImage, indexOfLastImage);
    const totalPages = Math.ceil(filteredGallery.length / imagesPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!modalOpen) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') {
                const currentIndex = filteredGallery.findIndex(img => img.id === selectedImage?.id);
                const prevIndex = (currentIndex - 1 + filteredGallery.length) % filteredGallery.length;
                setSelectedImage(filteredGallery[prevIndex]);
            }
            if (e.key === 'ArrowRight') {
                const currentIndex = filteredGallery.findIndex(img => img.id === selectedImage?.id);
                const nextIndex = (currentIndex + 1) % filteredGallery.length;
                setSelectedImage(filteredGallery[nextIndex]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, selectedImage, filteredGallery]);

    return (
        <div className="gallery-page">
            {/* Hero Section with Carousel Background */}
            <div className="gallery-page-hero">
                <div className="hero-carousel">
                    {bgImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`hero-carousel-slide ${idx === currentBgIndex ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                </div>
                <div className="gallery-page-hero-overlay"></div>
                <div className="gallery-page-hero-content">
                    <div className="hero-logo">
                        <i className="fas fa-sun"></i>
                        <h1>iWander PH</h1>
                    </div>
                    <h2>Our Gallery</h2>
                    <p>Explore beautiful moments captured across the Philippines</p>
                    <div className="gallery-page-stats">
                        <div className="stat">
                            <div className="stat-icon">
                                <i className="fas fa-image"></i>
                            </div>
                            <span className="stat-number">{gallery.length}</span>
                            <span className="stat-label">Photos</span>
                        </div>
                        <div className="stat">
                            <div className="stat-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <span className="stat-number">{filteredGallery.length}</span>
                            <span className="stat-label">Moments</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Filters Bar with Home Button */}
            <div className="gallery-page-filters">
                <div className="filters-container">
                    {/* Home Button - Sticky */}
                    <button className="home-nav-btn" onClick={() => navigate('/')}>
                        <i className="fas fa-home"></i>
                        <span>Home</span>
                    </button>

                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search photos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="sort-box">
                        <i className="fas fa-sort"></i>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title">Sort by Title</option>
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                            <i className="fas fa-th"></i>
                        </button>
                        <button className={viewMode === 'masonry' ? 'active' : ''} onClick={() => setViewMode('masonry')}>
                            <i className="fas fa-grip"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="gallery-page-loader">
                    <div className="loader"></div>
                    <p>Loading beautiful moments...</p>
                </div>
            ) : (
                <>
                    <div className={`gallery-page-grid ${viewMode}`}>
                        {currentImages.map((image, idx) => (
                            <div
                                key={image.id || idx}
                                className="gallery-page-item"
                                onClick={() => openModal(image)}
                            >
                                <div className="gallery-page-image-wrapper">
                                    <img src={image.url} alt={image.title || 'Gallery image'} loading="lazy" />
                                    <div className="gallery-page-overlay">
                                        <div className="overlay-content">
                                            <i className="fas fa-search-plus"></i>
                                            <h4>{image.title || 'Untitled'}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="gallery-page-pagination">
                            <button onClick={goToPrevPage} disabled={currentPage === 1}>
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <span className="page-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                                Next <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}

                    {/* No Results */}
                    {filteredGallery.length === 0 && (
                        <div className="gallery-page-empty">
                            <i className="fas fa-camera"></i>
                            <h3>No photos found</h3>
                            <p>Try adjusting your search or check back later</p>
                        </div>
                    )}
                </>
            )}

            {/* Lightbox Modal */}
            {modalOpen && selectedImage && (
                <div className="gallery-page-modal" onClick={closeModal}>
                    <div className="gallery-page-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <i className="fas fa-times"></i>
                        </button>
                        <img src={selectedImage.url} alt={selectedImage.title} />
                        {selectedImage.title && (
                            <div className="modal-caption">
                                <h3>{selectedImage.title}</h3>
                            </div>
                        )}
                        <div className="modal-nav">
                            <button className="modal-prev" onClick={() => {
                                const currentIndex = filteredGallery.findIndex(img => img.id === selectedImage.id);
                                const prevIndex = (currentIndex - 1 + filteredGallery.length) % filteredGallery.length;
                                setSelectedImage(filteredGallery[prevIndex]);
                            }}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button className="modal-next" onClick={() => {
                                const currentIndex = filteredGallery.findIndex(img => img.id === selectedImage.id);
                                const nextIndex = (currentIndex + 1) % filteredGallery.length;
                                setSelectedImage(filteredGallery[nextIndex]);
                            }}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryPage;