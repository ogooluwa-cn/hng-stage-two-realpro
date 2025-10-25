import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./component/navbar";
import Landing from "./component/landing";
import Login from "./component/login";
import Signup from "./component/signup";
import Dashboard from "./component/dashboard";
import Ticket from "./component/ticket";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/page/login" element={<Login />} />
          <Route path="/page/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pages/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pages/ticket" 
            element={
              <ProtectedRoute>
                <Ticket />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;