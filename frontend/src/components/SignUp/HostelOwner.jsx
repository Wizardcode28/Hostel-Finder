import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HostelOwner.css"

const HostelOwner = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false); // Corrected useState initialization
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.email || formData.password.length < 6) {
            setError("Please fill all fields and ensure the password is at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        setIsLoading(true);
        // Exclude confirmPassword from the data sent to the backend
        const { confirmPassword, ...dataToSend } = formData; 

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/owner/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify(dataToSend),
            });
            console.log(response)
            let responseData={}
            try {
                responseData= await response.json()
            } catch (error) {
                console.warn("Could not parse JSON response on error.")
            }
            console.log(responseData)
            if (response.ok && responseData.success) {
                alert("Account created successfully! Please proceed to register your hostel.");
                // Redirect to the hostel registration form or login page
                navigate('/hostelform'); 
            } else {
                // Display specific error message from the backend if available
                if(response.status===409) setError("Hostel Owner with same name or email already exist")
                else setError(responseData.message || "Registration failed. Please check your credentials.");
            }
        } catch (err) {
            setError("Network error. Could not connect to the server.");
            console.error("Signup Submission Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="owner-signup-container">
            <div className="signup-card">
                
                <div className="text-center">
                    <h2 className="signup-title">Hostel Owner Sign Up</h2>
                    <p className="signup-subtitle">
                        Create your account before registering your hostel.
                    </p>
                </div>

                <form className="signup-form" onSubmit={handleSubmit}>
                    
                    {/* Error Message Display */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="input-label">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="signup-input"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="input-label">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="signup-input"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="input-label">Password (Min 6 Chars)</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="signup-input"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className="signup-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`signup-btn ${isLoading ? 'btn-disabled' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Create Owner Account'}
                    </button>
                </form>

                <div className="login-link-container">
                    <p className="login-link-text">
                        Already have an account? 
                        <span 
                            className="login-link"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default HostelOwner;
