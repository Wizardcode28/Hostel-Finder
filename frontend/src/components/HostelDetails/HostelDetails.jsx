import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for the back button

const HostelDetails = () => {
    // 1. Get location state passed via useNavigate
    const location = useLocation();
    const navigate = useNavigate();

    // 2. Safely retrieve the hostel object, falling back to an empty object if state is lost (e.g., refresh)
    const hostel = location.state?.hostel || {}; 

    // Helper function to format strings
    const capitalize = (s) => {
        if (typeof s !== 'string') return s;
        // Handles case where value might be null or zero length string
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); 
    };

    // Helper function to render a rating block
    const renderRating = (rating, count) => {
        const fullStars = '⭐'.repeat(Math.round(rating || 0));
        return (
            <div className="flex items-center space-x-2">
                <span className="text-xl">{fullStars}</span>
                <span className="text-lg font-bold text-gray-800">{rating || 'N/A'}</span>
                <span className="text-sm text-gray-500">({count || 0} reviews)</span>
            </div>
        );
    };
    
    // Helper function to render a detail item (icon, label, value)
    const DetailItem = ({ label, value, icon, className = '' }) => (
        <div className={`detail-item ${className}`}>
            <div className="detail-item-icon">{icon}</div>
            <div className="detail-item-content">
                <div className="detail-item-label">{label}</div>
                <div className="detail-item-value">{value}</div>
            </div>
        </div>
    );

    // 🛑 FIX: Check if essential data (_id) exists after retrieving from location
    if (!hostel._id) {
        return (
            <div className="detail-container">
                <header className="detail-header">
                    <button onClick={() => navigate(-1)} className="back-button">← Back to Search</button>
                    <h1 className="detail-title">Details Not Found</h1>
                    <div className="w-16"></div>
                </header>
                <div className="detail-not-found">
                    <p>Hostel details were not found, likely due to a page refresh or direct URL access.</p>
                    <button onClick={() => navigate('/')} className="back-button-footer">Go to Search Page</button>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-container">
            
            <header className="detail-header">
                {/* Use navigate(-1) to go back */}
                <button onClick={() => navigate(-1)} className="back-button">← Back to Search</button>
                <h1 className="detail-title">{hostel.name}</h1>
                <div className="w-16"></div> {/* Spacer for alignment */}
            </header>

            {/* Main Content Grid */}
            <main className="detail-main-grid">
                
                {/* --- Left Column: Image, Description, and Details --- */}
                <div className="detail-info-column">
                    
                    {/* Image & Price Banner */}
                    <div className="detail-image-banner">
                        {hostel.image ? (
                            <img src={hostel.image} alt={hostel.name} className="hostel-detail-image" onError={(e) => e.target.src='https://placehold.co/600x400/94A3B8/FFFFFF?text=No+Image'} />
                        ) : (
                            <div className="image-placeholder-large">🏠 No Image Available</div>
                        )}
                        <div className="price-tag-overlay">
                            <span className="price-tag-value">₹{hostel.price}/mo</span>
                            <span className="price-tag-label">Per Bed</span>
                        </div>
                    </div>

                    {/* Rating and Review Summary */}
                    <div className="detail-rating-summary">
                        {renderRating(hostel.rating, hostel.reviewsCount)}
                    </div>
                    
                    {/* Full Description */}
                    <section className="detail-section">
                        <h2 className="section-header">About the Hostel</h2>
                        <p className="detail-description">{hostel.desc}</p>
                    </section>
                    
                    {/* Key Details */}
                    <section className="detail-section">
                        <h2 className="section-header">Key Information</h2>
                        <div className="key-details-grid">
                            {/* Value is now safely formatted */}
                            <DetailItem label="Room Type" value={capitalize(hostel.roomType)} icon="🛌" />
                            <DetailItem label="Gender" value={capitalize(hostel.gender)} icon="🚻" />
                            <DetailItem label="Available Rooms" value={hostel.noOfRooms} icon="🚪" />
                            {/* Distance is crucial and should be displayed prominently */}
                            <DetailItem label="Distance" value={`${hostel.distance} km`} icon="📍" className="distance-item" />
                        </div>
                    </section>

                    {/* Contact Info */}
                    <section className="detail-section contact-section">
                        <h2 className="section-header">Contact & Location</h2>
                        <div className="contact-details">
                            <p><strong>Address:</strong> {hostel.address}, {hostel.city}, {hostel.state} - {hostel.pinCode}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${hostel.email}`}>{hostel.email}</a></p>
                            <p><strong>Phone:</strong> <a href={`tel:${hostel.phone}`}>{hostel.phone}</a></p>
                        </div>
                    </section>

                </div>

                {/* --- Right Column: Facilities List --- */}
                <div className="detail-facilities-column">
                    <section className="detail-section facilities-section">
                        <h2 className="section-header">Facilities & Amenities</h2>
                        <div className="amenity-list">
                            {hostel.facilities && hostel.facilities.length > 0 ? (
                                hostel.facilities.map((f, index) => (
                                    <span key={index} className="amenity-tag-large">✅ {f}</span>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific amenities listed.</p>
                            )}
                        </div>
                    </section>
                    
                    {/* Placeholder for future Map View */}
                    <div className="map-placeholder">
                        Map View Coming Soon!
                        <p className="text-sm mt-2 text-gray-500">Hostel location at {hostel.location?.coordinates?.[1]}, {hostel.location.coordinates[0]}</p>
                    </div>
                </div>

            </main>

            <footer className="detail-footer">
                <button onClick={() => navigate(-1)} className="back-button-footer">← Back to Search</button>
            </footer>

        </div>
    );
};

export default HostelDetails;
