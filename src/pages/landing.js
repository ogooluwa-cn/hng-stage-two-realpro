import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/land.css";

export default function Landing() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // Listen for theme changes from navbar
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme");
      setDarkMode(currentTheme === "dark");
    };

    // Listen for storage changes (when navbar toggles theme)
    window.addEventListener('storage', handleThemeChange);
    
    // Also check periodically (fallback)
    const interval = setInterval(handleThemeChange, 1000);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="page active" id="landingPage">
      <section className="hero">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Streamline Your Ticket Management</h1>
            <p>Efficiently handle support tickets with RealPro's powerful and intuitive platform designed for modern teams.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => navigateTo('/page/login')}>Get Started</button>
              <button className="btn btn-secondary" onClick={() => navigateTo('/page/signup')}>Sign Up Free</button>
            </div>
          </div>
        </div>
        <div className="wave"></div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose RealPro?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Smart Ticket Management</h3>
              <p>Create, track, and resolve tickets with our intuitive workflow designed for efficiency.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Monitor performance with live dashboards and detailed reporting.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Bank-level security with role-based access control and audit logs.</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2025 RealPro UI Design. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}