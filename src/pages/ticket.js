import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/ticket.css";
import "../style/land.css";

export default function Ticket() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load tickets from localStorage on component mount
  useEffect(() => {
    const loadTickets = () => {
      try {
        const savedTickets = localStorage.getItem("tickets");
        if (savedTickets) {
          const parsedTickets = JSON.parse(savedTickets);
          setTickets(parsedTickets);
        } else {
          // If no tickets in localStorage, initialize with empty array
          setTickets([]);
        }
      } catch (error) {
        console.error("Error loading tickets:", error);
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();

    // Listen for storage changes (when new tickets are added from CreateTicket page)
    const handleStorageChange = (e) => {
      if (e.key === "tickets") {
        loadTickets();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also set up a custom event listener for same-tab updates
    const handleTicketUpdate = () => {
      loadTickets();
    };

    window.addEventListener('ticketUpdated', handleTicketUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ticketUpdated', handleTicketUpdate);
    };
  }, []);

  // Filter tickets based on search and filters
  useEffect(() => {
    let filtered = tickets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigateTo('/page/login');
    }
  }, [navigate]);

  const showToast = (message, type = "success") => {
    console.log(`${type.toUpperCase()}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const deleteTicket = (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      const updatedTickets = tickets.filter(ticket => ticket.id !== id);
      setTickets(updatedTickets);
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('ticketUpdated'));
      
      showToast('Ticket deleted successfully!', 'success');
    }
  };

  const editTicket = (id) => {
    showToast(`Edit ticket ${id} - Feature coming soon!`, 'info');
  };

  const viewTicket = (id) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      const ticketDetails = `
🎫 TICKET DETAILS

📋 Title: ${ticket.title}
📝 Description: ${ticket.description}
🔄 Status: ${formatStatus(ticket.status)}
🚨 Priority: ${formatPriority(ticket.priority)}
📂 Category: ${ticket.category}
📅 Created: ${ticket.createdAt}
✏️ Last Updated: ${ticket.updatedAt}
👤 Created By: ${ticket.createdBy || 'Unknown'}
🆔 Ticket ID: ${ticket.id}
      `;
      alert(ticketDetails);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in_progress': return 'status-in-progress';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const formatPriority = (priority) => {
    return priority.toUpperCase();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  if (isLoading) {
    return (
      <div className="page active" id="ticketsPage">
        <div className="ticket-management">
          <div className="container">
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading tickets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active" id="ticketsPage">
      <div className="ticket-management">
        <div className="container">
          <div className="management-header">
            <h2 className="section-title" style={{ margin: 0 }}>Ticket Management</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => navigateTo('/pages/create-ticket')}
            >
              + Create Ticket
            </button>
          </div>

          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                className="form-input"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <select
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {(searchTerm || statusFilter || priorityFilter) && (
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={clearFilters}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="tickets-summary">
            <div className="summary-item">
              <span className="summary-label">Total Tickets:</span>
              <span className="summary-value">{tickets.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Open:</span>
              <span className="summary-value">
                {tickets.filter(t => t.status === 'open').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">In Progress:</span>
              <span className="summary-value">
                {tickets.filter(t => t.status === 'in_progress').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Closed:</span>
              <span className="summary-value">
                {tickets.filter(t => t.status === 'closed').length}
              </span>
            </div>
          </div>

          <div className="tickets-grid" id="ticketsList">
            {filteredTickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-title">{ticket.title}</div>
                  <span className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                </div>
                <div className="ticket-meta">
                  <span>Created: {ticket.createdAt}</span>
                  <span className={`priority-badge ${getPriorityBadgeClass(ticket.priority)}`}>
                    {formatPriority(ticket.priority)} PRIORITY
                  </span>
                  {ticket.category && (
                    <span className="ticket-category">{ticket.category}</span>
                  )}
                </div>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-actions">
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => editTicket(ticket.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={() => viewTicket(ticket.id)}
                  >
                    View
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => deleteTicket(ticket.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="empty-state" id="emptyState">
              <div className="empty-state-icon">🎫</div>
              <h3>No tickets found</h3>
              <p>
                {searchTerm || statusFilter || priorityFilter 
                  ? "Try adjusting your search or filters" 
                  : "Create your first ticket to get started!"
                }
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigateTo('/pages/create-ticket')} 
                style={{ marginTop: "1rem" }}
              >
                Create Your First Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}