import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/dashboard.css";    
import "../style/form.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
    highPriorityTickets: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate('/');
  };

  // Calculate ticket statistics from localStorage
  const calculateTicketStats = () => {
    try {
      const savedTickets = localStorage.getItem("tickets");
      const tickets = savedTickets ? JSON.parse(savedTickets) : [];

      const totalTickets = tickets.length;
      const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
      const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length;
      const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
      const highPriorityTickets = tickets.filter(ticket => ticket.priority === 'high' || ticket.priority === 'urgent').length;

      // Get recent tickets (last 5)
      const recent = tickets
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return {
        totalTickets,
        openTickets,
        inProgressTickets,
        closedTickets,
        highPriorityTickets,
        recentTickets: recent
      };
    } catch (error) {
      console.error("Error calculating ticket stats:", error);
      return {
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0,
        closedTickets: 0,
        highPriorityTickets: 0,
        recentTickets: []
      };
    }
  };

  // Load dashboard data
  useEffect(() => {
    if (!isAuthenticated()) {
      navigateTo('/page/login');
      return;
    }

    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ticketStats = calculateTicketStats();
      setStats({
        totalTickets: ticketStats.totalTickets,
        openTickets: ticketStats.openTickets,
        inProgressTickets: ticketStats.inProgressTickets,
        closedTickets: ticketStats.closedTickets,
        highPriorityTickets: ticketStats.highPriorityTickets
      });
      setRecentTickets(ticketStats.recentTickets);
      
      setIsLoading(false);
    };

    loadDashboardData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      const ticketStats = calculateTicketStats();
      setStats({
        totalTickets: ticketStats.totalTickets,
        openTickets: ticketStats.openTickets,
        inProgressTickets: ticketStats.inProgressTickets,
        closedTickets: ticketStats.closedTickets,
        highPriorityTickets: ticketStats.highPriorityTickets
      });
      setRecentTickets(ticketStats.recentTickets);
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Listen for storage changes (when tickets are updated in other components)
  useEffect(() => {
    const handleStorageChange = () => {
      const ticketStats = calculateTicketStats();
      setStats({
        totalTickets: ticketStats.totalTickets,
        openTickets: ticketStats.openTickets,
        inProgressTickets: ticketStats.inProgressTickets,
        closedTickets: ticketStats.closedTickets,
        highPriorityTickets: ticketStats.highPriorityTickets
      });
      setRecentTickets(ticketStats.recentTickets);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get user info from session
  const getUserInfo = () => {
    const session = localStorage.getItem("userSession");
    if (!session) return null;

    try {
      const userSession = JSON.parse(session);
      return {
        name: userSession.name,
        email: userSession.email
      };
    } catch {
      return null;
    }
  };

  const user = getUserInfo();

  const formatStatus = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const formatPriority = (priority) => {
    return priority.toUpperCase();
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
      case 'urgent': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="page active" id="dashboardPage">
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h2 className="section-title">Dashboard Overview</h2>
            {user && (
              <div className="user-welcome">
                Welcome back, <strong>{user.name}</strong>!
              </div>
            )}
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">
                {isLoading ? (
                  <div className="loading-dots">...</div>
                ) : (
                  stats.totalTickets
                )}
              </div>
              <div className="stat-label">Total Tickets</div>
              {!isLoading && (
                <div className="stat-subtext">All support requests</div>
              )}
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {isLoading ? (
                  <div className="loading-dots">...</div>
                ) : (
                  stats.openTickets
                )}
              </div>
              <div className="stat-label">Open Tickets</div>
              {!isLoading && (
                <div className="stat-subtext">Awaiting response</div>
              )}
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {isLoading ? (
                  <div className="loading-dots">...</div>
                ) : (
                  stats.inProgressTickets
                )}
              </div>
              <div className="stat-label">In Progress</div>
              {!isLoading && (
                <div className="stat-subtext">Being worked on</div>
              )}
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {isLoading ? (
                  <div className="loading-dots">...</div>
                ) : (
                  stats.closedTickets
                )}
              </div>
              <div className="stat-label">Resolved Tickets</div>
              {!isLoading && (
                <div className="stat-subtext">Successfully closed</div>
              )}
            </div>
          </div>

          {/* Recent Tickets Section
          {recentTickets.length > 0 && (
            <div className="recent-tickets">
              <h3 className="section-subtitle">Recent Tickets</h3>
              <div className="recent-tickets-grid">
                {recentTickets.map(ticket => (
                  <div key={ticket.id} className="recent-ticket-card">
                    <div className="recent-ticket-header">
                      <h4 className="recent-ticket-title">{ticket.title}</h4>
                      <span className={`status-badge-sm ${getStatusBadgeClass(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    </div>
                    <div className="recent-ticket-meta">
                      <span>Priority: </span>
                      <span className={`priority-badge-sm ${getPriorityBadgeClass(ticket.priority)}`}>
                        {formatPriority(ticket.priority)}
                      </span>
                      <span>Created: {ticket.createdAt}</span>
                    </div>
                    <p className="recent-ticket-description">
                      {ticket.description.length > 100 
                        ? `${ticket.description.substring(0, 100)}...` 
                        : ticket.description
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          <div className="dashboard-actions">
            <div className="action-card" onClick={() => navigateTo('/pages/ticket')}>
              <div className="action-icon">🎫</div>
              <h3>Manage Tickets</h3>
              <p>View and manage all support tickets in one place</p>
            </div>
            <div className="action-card" onClick={() => navigateTo('/pages/create-ticket')}>
              <div className="action-icon">➕</div>
              <h3>Create Ticket</h3>
              <p>Create a new support ticket for your team</p>
            </div>
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>Analytics</h3>
              <p>View detailed reports and performance insights</p>
            </div>
            <div className="action-card" onClick={handleLogout}>
              <div className="action-icon">🚪</div>
              <h3>Logout</h3>
              <p>Sign out of your account securely</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}