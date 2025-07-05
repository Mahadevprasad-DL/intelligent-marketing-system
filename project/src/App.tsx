import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import AIChat from './components/AIChat';
import CustomerJourney from './components/CustomerJourney';
import Analytics from './components/Analytics';
import ProductRecommendation from './components/ProductRecommendation';
import UserProfile from './components/UserProfile';
import TrendAnalyzer from './components/TrendAnalyzer';
import RequestOtp from './components/requestOtp'; 
import VerifyOtp from './components/verifyOtp'; // ✅ Add this
// import RequestOtp from './components/RequestOtp'; // Only if you split it from Login

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main login page */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* OTP Verification */}
          {/* Only if you separated OTP request from Login */}
          {/* <Route path="/request-otp" element={<RequestOtp />} /> */}
          <Route path="/request-otp" element={<RequestOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

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
            path="/campaigns" 
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-chat" 
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer-journey" 
            element={
              <ProtectedRoute>
                <CustomerJourney />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/product-recommendation" 
            element={
              <ProtectedRoute>
                <ProductRecommendation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trend-analyzer" 
            element={
              <ProtectedRoute>
                <TrendAnalyzer />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
