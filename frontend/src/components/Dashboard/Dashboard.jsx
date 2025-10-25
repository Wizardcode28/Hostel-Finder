import React, { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import "./Dashboard.css"

const Dashboard = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [myHostel, setMyHostel] = useState(null);
    const [ownerName, setOwnerName] = useState("Owner");
    const [fetchError, setFetchError] = useState(null);

    const accessToken = localStorage.getItem('accessToken') || ''; 

    useEffect(() => {
        if (!accessToken || accessToken === '') {
            // If no token, redirect to login (Unauthenticated state)
            setFetchError("User not logged in. Redirecting to login.");
            setIsLoading(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const fetchHostelData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/hostel/my-hostel`, {
                    method: 'GET',
                    headers:{
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', 
                });
                let data={}
                try {
                    data= await response.json()
                } catch (jsonError) {
                    console.log("Error while parsing JSON data",jsonError)
                }
                if (response.ok && data.success) {
                    // Assuming the backend returns the hostel document in data.data
                    console.log(data)
                    setMyHostel(data.data); 
                    setOwnerName(data.data.ownerName || "Hostel Manager"); // Placeholder for owner name
                }
                else if(response.status===401){
                    alert("First login: Authentication failed")
                }
                else if (response.status === 404) {
                    // Hostel not registered yet
                    setMyHostel(null); 
                    console.log("No hostel found for this owner.");
                }
                else {
                    // Generic API error
                    setFetchError(data.message || `Failed to fetch data (HTTP ${response.status})`);
                }
            } catch (error) {
                console.error("Network or Fetch Error:", error);
                setFetchError("Could not connect to the server to fetch hostel data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHostelData();
    }, [accessToken, navigate]);
    
    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            // Clear client-side token
            localStorage.removeItem('accessToken'); 
            
            // Call backend to invalidate RT cookie and DB token
            try {
                await fetch(`${import.meta.env.VITE_API_BASE_URL}/owner/logout`, {
                    method: 'POST',
                    credentials: 'include',
                });
            } catch (error) {
                console.error("Logout error:", error);
            }
            
            navigate('/login'); 
        }
    };

    const renderLoadingState = () => (
        <div className="dashboard-status-box loading-box">
            <div className="spinner"></div>
            <p className="mt-4 text-lg">Loading Dashboard and verifying your hostel status...</p>
        </div>
    );

    const handleRegisterHostel = () => {
        navigate('/hostelform');
    };

    const renderUnregisteredState = () => (
        <div className="dashboard-status-box unregistered-box">
            <h2 className="text-3xl font-bold text-red-600">No Hostel Registered</h2>
            <p className="mt-4 text-lg text-gray-700">It looks like you haven't listed a hostel yet.</p>
            <button 
                onClick={handleRegisterHostel} 
                className="action-button register-button"
            >
                Register Your First Hostel Now
            </button>
        </div>
    );

    const renderHostelDetails = () => (
        <div className="hostel-details-view">
            <div className="hostel-header-bar">
                <h2 className="text-3xl font-bold text-indigo-700">{myHostel.name}</h2>
                <div className="actions">
                    <button 
                        onClick={() => handleUpdateDetails(myHostel._id)} 
                        className="action-button update-button"
                    >
                        Update Listing
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="action-button logout-button-small"
                    >
                        Logout
                    </button>
                </div>
            </div>
            
            <div className="hostel-main-content">
                {/* Image and Basic Info */}
                <div className="hostel-info-card">
                    <img 
                        src={myHostel.image || 'https://placehold.co/600x400/94A3B8/FFFFFF?text=Hostel+Image'} 
                        alt={`${myHostel.name} image`} 
                        className="hostel-image-detail"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400/94A3B8/FFFFFF?text=No+Image'; }}
                    />
                    <div className="info-grid">
                        <div className="info-item"><strong>Price:</strong> <span>₹{myHostel.price}/mo</span></div>
                        <div className="info-item"><strong>Rooms:</strong> <span>{myHostel.noOfRooms} available</span></div>
                        <div className="info-item"><strong>Gender:</strong> <span>{myHostel.gender}</span></div>
                        <div className="info-item"><strong>Room Type:</strong> <span>{myHostel.roomType==='single'? 'Single Room': myHostel.roomType==='double'? 'Double Room': 'Dormitory Bed'}</span></div>
                        <div className="info-item"><strong>Rating:</strong> <span>{'⭐'.repeat(Math.round(myHostel.rating || 0))} ({myHostel.reviewsCount})</span></div>
                    </div>
                </div>

                {/* Description and Address */}
                <div className="description-card">
                    <h3 className="section-title">Description</h3>
                    <p className="text-gray-700">{myHostel.desc}</p>
                    
                    <h3 className="section-title mt-4">Location Details</h3>
                    <p className="text-gray-700"><strong>Address:</strong> {myHostel.address}, {myHostel.city}, {myHostel.state} - {myHostel.pinCode}</p>
                    <p className="text-gray-700"><strong>Contact:</strong> {myHostel.phone} | {myHostel.email}</p>
                    <p className="text-gray-700 text-sm mt-2">Coordinates: [{myHostel.location?.coordinates[0]}, {myHostel.location?.coordinates[1]}]</p>
                </div>

                {/* Facilities */}
                <div className="facilities-card">
                    <h3 className="section-title">Facilities</h3>
                    <div className="amenity-list-dashboard">
                        {myHostel.facilities && myHostel.facilities.length > 0 ? (
                            myHostel.facilities.map((f, i) => (
                                <span key={i} className="amenity-tag-dash">✅ {f}</span>
                            ))
                        ) : (
                            <span className="text-gray-500">No amenities specified.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    
    // --- Main Render Switch ---
    const renderContent = () => {
        if (fetchError) {
            return (
                <div className="dashboard-status-box error-box">
                    <h2 className="text-3xl font-bold text-red-700">Access Denied / Error</h2>
                    <p className="mt-4 text-lg text-red-600">{fetchError}</p>
                    <button onClick={handleLogout} className="action-button logout-button">Go to Login</button>
                </div>
            );
        }
        if (isLoading) {
            return renderLoadingState();
        }
        if (myHostel && myHostel._id) {
            return renderHostelDetails();
        }
        return renderUnregisteredState();
    };


    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="header-title">Welcome, {ownerName}</h1>
                <nav className="header-nav">
                    {myHostel && (
                        <span className="nav-item status-indicator">Status: Active</span>
                    )}
                    {/* <button onClick={handleLogout} className="action-button logout-button">
                        Logout
                    </button> */}
                </nav>
            </header>
            
            <main className="dashboard-main-content">
                {renderContent()}
            </main>

        </div>
    );
};

export default Dashboard;
