import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        // Basic Client-side Validation 
        if (!formData.email || !formData.password) {
            setErrorMessage('Email and password are required.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/owner/login`, {
                method: 'POST',
                // IMPORTANT: The backend must be configured with CORS to accept credentials: true
                // if it sends HTTP-only cookies (recommended).
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            console.log(response)
            let responseData = {};
            try {
                responseData = await response.json();
            } catch (jsonError) {
                // This handles cases where the server returns non-JSON content on error
                console.warn("Could not parse JSON response on error.");
            }
            console.log(responseData)
            if (response.ok && responseData.success) {
                alert("Login successful! Redirecting to Dashboard.");

                localStorage.setItem('accessToken',responseData.data.accessToken)
                navigate('/dashboard'); 
            } 
            else if(response.status===401){
                setErrorMessage("Please provide correct details!");
            }
            else if (response.status === 404) {
                setErrorMessage("No Hostel Owner found");
            }
            else {
                const serverMessage = responseData.message || `Login failed (HTTP ${response.status}).`;
                setErrorMessage(serverMessage);
            }

        } catch (error) {
            // Handles genuine network failures (server down)
            console.error("Network Error:", error);
            setErrorMessage('A network error occurred. Server may be unreachable.');
        } finally {
            setIsLoading(false);
        }
    };

    const isButtonDisabled = isLoading || !formData.email || !formData.password;

    return (
        <div className="owner-signup-container">
            <div className="signup-card">
                <div className='text-center'>
                    <h1 className="signup-title">Hostel Owner Sign In</h1>
                    <p className="signup-subtitle">Access your dashboard to manage your hostel.</p>
                </div>
                
                {/* Error Message Display */}
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}
                <form className="signup-form" onSubmit={handleSubmit}>
                    
                    <div>
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="signup-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="signup-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`signup-btn ${isButtonDisabled ? 'btn-disabled' : ''}`}
                        disabled={isButtonDisabled}
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-link-container">
                    <span className="login-link-text">Don't have an account?</span>
                    <a className="login-link" onClick={() => navigate('/signup')}>
                        Sign Up
                    </a>
                </div>
            </div>
        
        </div>
    );
};

export default Login;
