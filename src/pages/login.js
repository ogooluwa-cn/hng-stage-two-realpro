import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const USERS_KEY = "realpro_users";
  const AUTH_KEY = "userSession";

  // Generate a secure random token
  const generateToken = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;

    try {
      const userSession = JSON.parse(session);
      const isValid = userSession && 
                     userSession.token && 
                     userSession.expires > Date.now();
      return isValid;
    } catch {
      return false;
    }
  };

  // Check if user exists in localStorage
  const validateUserCredentials = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const user = users.find(user => 
      user.email === email && user.password === password && user.isActive
    );
    return user || null;
  };

  const showToast = (message, type = "success") => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const login = async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const user = validateUserCredentials(email, password);
      
      if (user) {
        // Generate secure token
        const token = generateToken();
        const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        const userSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          token: token,
          expires: expirationTime,
          issuedAt: Date.now(),
          role: user.role || 'user' // Default role
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(userSession));
        showToast('Login successful!', 'success');
        navigateTo('/dashboard');
        return true;
      } else {
        // Check if email exists but password is wrong
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
        const emailExists = users.some(user => user.email === email);
        
        if (emailExists) {
          setErrors(prev => ({
            ...prev,
            password: "Invalid password"
          }));
          showToast('Invalid password. Please try again.', 'error');
        } else {
          setErrors(prev => ({
            ...prev,
            email: "Email not found. Please sign up first."
          }));
          showToast('Account not found. Please sign up to create an account.', 'error');
        }
        return false;
      }
    } catch (error) {
      showToast('Login failed. Please try again.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      login(formData.email, formData.password);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigateTo('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="page active" id="loginPage">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo" onClick={() => navigateTo('/')}>
              RealPro
            </div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form id="loginForm" onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="loginEmail">
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                id="loginEmail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="error-message" id="loginEmailError">
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <div className="form-label-container">
                <label className="form-label" htmlFor="loginPassword">
                  Password
                </label>
                <a className="forgot-password" onClick={() => showToast('Password reset feature coming soon!', 'info')}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                id="loginPassword"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="error-message" id="loginPasswordError">
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
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
                  Signing In...
                </>
              ) : (
                'Sign In'
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
            Don't have an account?{" "}
            <a onClick={() => navigateTo('/page/signup')} className="auth-link">
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}