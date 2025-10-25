// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../style/nav.css";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [logoutAnimation, setLogoutAnimation] = useState(false);

//   // Initialize theme
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
//     if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
//       setDarkMode(true);
//       document.documentElement.setAttribute("data-theme", "dark");
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
    
//     if (newDarkMode) {
//       document.documentElement.setAttribute("data-theme", "dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.setAttribute("data-theme", "light");
//       localStorage.setItem("theme", "light");
//     }
//   };

//   const handleLogoutClick = () => {
//     setShowLogoutConfirm(true);
//   };

//   const confirmLogout = () => {
//     setShowLogoutConfirm(false);
//     setLogoutAnimation(true);
    
//     // Wait for animation to complete before logging out
//     setTimeout(() => {
//       localStorage.removeItem("AUTH_KEY");
//       navigate('/landing');
//     }, 1000);
//   };

//   const cancelLogout = () => {
//     setShowLogoutConfirm(false);
//   };

//   return (
//     <div className="header">
//       <nav className="nav">
//         <div className="logo" onClick={() => navigate('/')}>RealPro</div>
         
//         <div className="nav-links" id="navLinks">
//               {/* Dark/Light Mode Switch Button */}
//           <div className="switch-container">
//             <label className="switch">
//               <input 
//                 type="checkbox" 
//                 checked={darkMode}
//                 onChange={toggleDarkMode}
//               />
//               <span className="slider">
//                 <span className="slider-icon sun">☀️</span>
//                 <span className="slider-icon moon">🌙</span>
//               </span>
//             </label>
//             <span className="switch-label">
//               {darkMode ? "Dark" : "Light"}
//             </span>
//           </div>
//           <a href="/pages/dashboard">Dashboard</a>
//           <a href="/pages/ticket">Ticket</a>
          
       
        

//           {/* Logout Button with Animation */}
//           <div className="action-card" onClick={handleLogoutClick}>
//             <h3 className={logoutAnimation ? "logout-animation" : ""}>
//               {logoutAnimation ? "Logging out..." : "Logout"}
//             </h3>
//           </div>
//         </div>
//       </nav>

//       {/* Logout Confirmation Alert */}
//       {showLogoutConfirm && (
//         <div className="alert-overlay">
//           <div className="alert-box">
//             <h3>Confirm Logout</h3>
//             <p>Are you sure you want to logout?</p>
//             <div className="alert-buttons">
//               <button className="btn-cancel" onClick={cancelLogout}>
//                 Cancel
//               </button>
//               <button className="btn-confirm" onClick={confirmLogout}>
//                 Yes, Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/nav.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutAnimation, setLogoutAnimation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setLogoutAnimation(true);
    
    // Wait for animation to complete before logging out
    setTimeout(() => {
      // Remove both authentication keys
      localStorage.removeItem("AUTH_KEY");
      localStorage.removeItem("userSession");
      
      // Show success message
      alert("Logged out successfully!");
      
      // Redirect to home page (landing page)
      navigate('/');
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="header">
      <nav className="nav">
        <div className="logo" onClick={() => navigate('/')}>RealPro</div>
        
        {/* Mobile Menu Button */}
        <div 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
         
        <div className={`nav-links ${mobileMenuOpen ? 'nav-links-active' : ''}`} id="navLinks">
          {/* Dark/Light Mode Switch Button */}
          <div className="switch-container">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider">
                <span className="slider-icon sun">☀️</span>
                <span className="slider-icon moon">🌙</span>
              </span>
            </label>
            <span className="switch-label">
              {darkMode ? "Dark" : "Light"}
            </span>
          </div>
          
          <a href="/pages/dashboard" onClick={closeMobileMenu}>Dashboard</a>
          <a href="/pages/ticket" onClick={closeMobileMenu}>Ticket</a>

          {/* Logout Button with Animation */}
          <div className="action-card" onClick={handleLogoutClick}>
            <h3 className={logoutAnimation ? "logout-animation" : ""}>
              {logoutAnimation ? "Logging out..." : "Logout"}
            </h3>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
        )}
      </nav>

      {/* Logout Confirmation Alert */}
      {showLogoutConfirm && (
        <div className="alert-overlay">
          <div className="alert-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="alert-buttons">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}