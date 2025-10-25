import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/land.css";
import "../style/form.css";
export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const USERS_KEY = "realpro_users";
  const AUTH_KEY = "userSession";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Check if email already exists
  const isEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return users.some(user => user.email === email);
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    } else if (isEmailExists(formData.email)) {
      newErrors.email = "Email already exists";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const saveUserToLocalStorage = (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, this should be hashed
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return newUser;
  };

  const showToast = (message, type = "success") => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        const newUser = saveUserToLocalStorage(formData);
        
        // Auto-login after signup
        const userSession = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          token: 'mock-jwt-token',
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(userSession));
        showToast('Account created successfully!', 'success');
        navigate('/dashboard');
        
      } catch (error) {
        showToast('Error creating account. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="page active" id="signupPage">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo" onClick={() => navigate('/')}>
              RealPro
            </div>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join thousands of teams using RealPro</p>
          </div>

          <form id="signupForm" onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signupName">
                Full Name
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                id="signupName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signupEmail">
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                id="signupEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signupPassword">
                Password
              </label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                id="signupPassword"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Create a password (min. 6 characters)"
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" required />
                <span className="checkmark"></span>
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button type="button" className="btn btn-social btn-google">
              <span className="social-icon">🔍</span>
              Google
            </button>
            <button type="button" className="btn btn-social btn-github">
              <span className="social-icon">💻</span>
              GitHub
            </button>
          </div>
          
          <div className="auth-switch">
            Already have an account?{" "}
            <a onClick={() => navigate('/page/login')} className="auth-link">
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}