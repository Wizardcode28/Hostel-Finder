import React, { useState } from 'react';
import './Student.css'; 
import { useNavigate } from 'react-router-dom';

const Student = () => {

  const navigate= useNavigate()

  const handleViewDetails= (hostelData)=>{
    navigate('/hostelDetails', { state: { hostel: hostelData } })
  }
  // State to hold the student's location and any other relevant data
  const [studentData, setStudentData] = useState({
    longitude: 0,
    latitude: 0
    // Add other fields needed for a student profile later (e.g., studentID)
  });
  const [hostelResults, sethostelResults] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Function to handle getting the current location from the browser
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please ensure your browser is up to date.");
      return;
    }

    setIsLoading(true);
    alert("Please allow access to your current location to find nearby hostels.");

    navigator.geolocation.getCurrentPosition(
      // Success Callback
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setStudentData(prevData => ({
          ...prevData,
          longitude: parseFloat(lng.toFixed(6)),
          latitude: parseFloat(lat.toFixed(6)),
        }));
        
        setIsLoading(false);
        console.log(`Student Location Captured: Lat=${lat}, Lng=${lng}`);
      },
      // Error Callback
      (error) => {
        setIsLoading(false);
        let message = "Failed to get location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access denied. Cannot search for hostels without your location.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out.";
        }
        alert(message);
        console.error("Geolocation Error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  };

  const handleSearch = async (e) => {
   e.preventDefault()
   if(!studentData.longitude || !studentData.latitude){
    alert("Please capture your location first")
    return
   }
   const studentPayload={
    longitude: parseFloat(studentData.longitude),
    latitude: parseFloat(studentData.latitude)
   }
    try {
      const response= await fetch("http://localhost:8000/api/v1/hostel/search",{
        method:"POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify(studentPayload)
      }) 
      console.log(response)
      const data= await response.json()
      console.log("Searching for hostels near:", studentData.latitude, studentData.longitude);
      if(response.ok && data.success){
        sethostelResults(data.data || [])
        console.log("Search results received: ",data.data)
      }
    } catch (error) {
      console.error("Network or parsing error during search:", error);
      alert("A network error occurred during the search. Check the console.")
    }
    finally{
      setIsLoading(false)
    }
  };

const renderResults = () => {
    // Determine if the search found anything
    const hasResults = hostelResults.length > 0;
    
    if (isLoading) return <div className='result-loading'>Searching for nearest hostels... 🏃‍♂️</div>;
    if (searchPerformed && !hasResults)  return <div className="result-no-match">😢 No hostels found within the search radius. Try adjusting your search preferences later!</div>;

    if (hasResults) {
        return (
            <div className="result-list-container">
                <h3 className="results-title">Found {hostelResults.length} Hostels Near You:</h3>
                {/* Optional: Add Filter/Sort Bar here later */}
                <div className="results-filter-bar">
                    <span className="sort-hint">Sorted by: Nearest Distance</span>
                    <br /> <br />
                </div>

                {hostelResults.map((hostel) => (
                    <div key={hostel._id} className="hostel-card-improved">
                        
                        <div className="hostel-image-placeholder">
                            {/* In a real app, use <img src={hostel.image} /> */}
                            { hostel.image? <img src={hostel.image} alt="" />:"🏠"}
                        </div>

                        <div className="hostel-details-main">
                            <h4 className="hostel-name-title">{hostel.name}</h4>
                            <div className="hostel-rating">
                                {/* Use rating value if available */}
                                ⭐️ {hostel.rating || ''} ({hostel.reviewsCount || 0} reviews)
                            </div>

                            <p className="hostel-desc-summary">
                                {hostel.desc.substring(0, 70)}...
                            </p>

                            {/* Key Features / Amenities */}
                            <div className="hostel-amenities-list">
                                <span className="amenity-tag">{hostel.gender}</span>
                                <span className="amenity-tag">{hostel.roomType}</span>
                                {/* Add logic for facilities like WiFi later */}
                            </div>
                        </div>

                        {/* RIGHT SECTION: Price, Distance, & Action */}
                        <div className="hostel-summary-info">
                            <div className="distance-block">
                                <span className="distance-label">Distance</span>
                                <span className="distance-value">{hostel.distance} km</span>
                            </div>
                            
                            <div className="price-block">
                                <span className="price-value">₹{hostel.price}/mo</span>
                                <span className="price-per">per bed</span>
                            </div>

                            <button className="btn-view-details" onClick={()=>handleViewDetails(hostel)}>
                                View Details →
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        );
    }
    
    return null;
}

  return (
    <div className="finder-container">
      
      <header className="finder-header">
        <h1>Hostel Finder for Students 🏠</h1>
      </header>
      
      <main className="finder-main">
        <div className="finder-content-box">
          <h2>Find Your Perfect Stay</h2>
          <p>
            Welcome! To help you find the best and nearest hostels, we need to know where you are right now. 
            Click the button below to share your current location and start your search.
          </p>

          <form onSubmit={handleSearch} className="location-form">
            
            <div className="location-status-display">
              <p>
                Status: {studentData.latitude
                  ? `Location Found (Lat: ${studentData.latitude}, Lng: ${studentData.longitude})`
                  : isLoading
                  ? "Searching..."
                  : "Location not captured yet."
                }
              </p>
            </div>

            <button 
              type="button" 
              onClick={handleGetLocation}
              disabled={isLoading}
              className="location-btn"
            >
              {isLoading ? "Capturing Location..." : "Share My Current Location 📍"}
            </button>
            
            <button 
              type="submit" 
              disabled={!studentData.latitude || isLoading}
              className="search-btn"
            >
              Start Hostel Search
            </button>
          </form>
          
          <div className="disclaimer">
            We only use your location data once for the search and do not track your movement.
          </div>

          <div className="finder-results-area">
            {renderResults()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Student;