import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/ticket.css";
import "../style/land.css";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "technical"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const session = localStorage.getItem("userSession");
    if (!session) return false;

    try {
      const userSession = JSON.parse(session);
      return userSession && userSession.token && userSession.expires > Date.now();
    } catch {
      return false;
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const showToast = (message, type = "success") => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigateTo('/page/login');
    }
  }, [navigate]);

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
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get existing tickets from localStorage or initialize empty array
      const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      
      const newTicket = {
        id: Date.now(), // Use timestamp for unique ID
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category,
        status: "open",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: JSON.parse(localStorage.getItem("userSession")).email
      };

      // Add new ticket to the beginning of the array
      const updatedTickets = [newTicket, ...existingTickets];
      
      // Save to localStorage
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      
      // Trigger events to update other components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('ticketUpdated'));
      
      showToast('Ticket created successfully!', 'success');
      
      // Redirect to tickets page after successful creation
      setTimeout(() => {
        navigateTo('/pages/ticket');
      }, 1000);

    } catch (error) {
      console.error("Error creating ticket:", error);
      showToast('Failed to create ticket. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigateTo('/pages/ticket');
  };

  return (
    <div className="page active" id="createTicketPage">
      <div className="create-ticket">
        <div className="container">
          <div className="create-ticket-header">
            <button 
              className="btn btn-outline" 
              onClick={handleCancel}
            >
              ← Back to Tickets
            </button>
            <h2 className="section-title">Create New Ticket</h2>
            <p className="create-ticket-subtitle">
              Fill in the details below to create a new support ticket
            </p>
          </div>

          <div className="create-ticket-card">
            <form onSubmit={handleSubmit} className="create-ticket-form">
              <div className="form-group">
                <label className="form-label" htmlFor="ticketTitle">
                  Ticket Title *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  id="ticketTitle"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a clear and descriptive title"
                />
                {errors.title && (
                  <div className="error-message">{errors.title}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ticketDescription">
                  Description *
                </label>
                <textarea
                  className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                  id="ticketDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the issue or request..."
                  rows="6"
                />
                {errors.description && (
                  <div className="error-message">{errors.description}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="ticketPriority">
                    Priority
                  </label>
                  <select
                    className="form-select"
                    id="ticketPriority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ticketCategory">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="ticketCategory"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="support">General Support</option>
                    <option value="billing">Billing Issue</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Creating Ticket...
                    </>
                  ) : (
                    'Create Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="create-ticket-info">
            <h4>💡 Tips for creating effective tickets:</h4>
            <ul>
              <li>Be specific and descriptive in your title</li>
              <li>Include steps to reproduce the issue</li>
              <li>Add relevant screenshots or error messages</li>
              <li>Specify the expected vs actual behavior</li>
              <li>Choose the appropriate priority level</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}