import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import HomePage from "./components/HomePage";
import Navbar from './components/Navbar';

import LoginPage from './components/LoginPage';
import Dashboard from "./components/Dashboard";
import ClientProfileForm from './components/ClientProfileForm';
import Footer from './components/Footer';
import Photography from "./components/Photography"; 
import Videography from './components/Videography';
import EditingPage from './components/EditingPage';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';
import PaymentPage from './components/PaymentPage';
import CreateProfile from './components/CreateProfile';
import GraphicDesigning from './components/GraphicDesigning';
import ProgressSteps from './components/ProgressSteps';
import ResetPassword from "./components/ResetPassword";
import SMMDashboard from './components/SMMDashboard';
import Admin from './components/Admin';
import EmployeeDashboard from './components/EmployeeDashboard';
import FinanceManagerDashboard from './components/FinanceManagerDashboard';
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./components/AuthContext";

function App() {
  

  return (
     <AuthProvider> 
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} /> {/* Set Home Page as Default */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/create-profile" element={<CreateProfile />}/>
        <Route path="/editing" element={<EditingPage />} />
        <Route path="/video" element={<Videography />} />
        <Route path="/graphic-design" element={<GraphicDesigning />} />
        <Route path="/book" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
        <Route path="/ps" element={<ProgressSteps />} />
        <Route path="/smm-dashboard" element={<ProtectedRoute><SMMDashboard /></ProtectedRoute>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
    <Route path="/mybook" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
    <Route path="/admin-dashboard" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
    <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
    <Route path="/finance" element={<FinanceManagerDashboard/>} />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;









