import React from "react";
import "./HomePage.css";
import {useNavigate} from "react-router-dom"

const HomePage = () => {
  const navigate= useNavigate()

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🏠 HostelFinder</h1>
      </header>

      <main className="home-main">
        <div className="home-content">
          <h2>Find the Perfect Hostel Near You!</h2>
          <p>
            HostelFinder helps students discover comfortable and affordable
            hostels based on their preferences and current location. Hostel
            owners can easily add and manage their properties to reach students
            preparing for exams.
          </p>

          <div className="button-container">
            <button
              className="btn student-btn"
              onClick= {()=> navigate("/student")}
            >
              🎓 I'm a Student
            </button>
            <button
              className="btn hostel-btn"
              onClick= {()=> navigate("/hostel")}
            >
              🏘️ I'm a Hostel Owner
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HomePage;
