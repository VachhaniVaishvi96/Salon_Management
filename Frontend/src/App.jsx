import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import MasterLayout from './layouts/MasterLayout';

// Landing Pages
import Home from './pages/Landing/Home';
import About from './pages/Landing/About';
import Services from './pages/Landing/Services';
import BookAppointment from './pages/Landing/BookAppointment';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';

// Dashboard Pages
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import BarberPanel from './pages/Dashboard/BarberPanel';
import ReceptionistMatrix from './pages/Dashboard/ReceptionistMatrix';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import ProductStore from './pages/Dashboard/ProductStore';
import Settings from './pages/Dashboard/Settings';

// Customer Sub-components
import UpcomingVisits from './components/Dashboard/Customer/UpcomingVisits';
import FavoredTreatments from './components/Dashboard/Customer/FavoredTreatments';
import VisitHistory from './components/Dashboard/Customer/VisitHistory';
import PurchaseHistory from './components/Dashboard/Customer/PurchaseHistory';

import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Landing Pages Group */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Authenticated Dashboard Pages Group (Guarded) */}
      <Route path="/dashboard" element={<MasterLayout />}>
        <Route index element={<Navigate to="customer" replace />} />
        
        {/* Customer sub-pages */}
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="customer/appointments" element={<div className="max-w-3xl"><UpcomingVisits /></div>} />
        <Route path="customer/treatments" element={<div className="max-w-3xl"><FavoredTreatments /></div>} />
        <Route path="customer/ledger" element={<div className="max-w-5xl"><VisitHistory /></div>} />
        <Route path="customer/purchases" element={<div className="max-w-5xl"><PurchaseHistory /></div>} />

        <Route path="barber" element={<BarberPanel />} />
        <Route path="receptionist" element={<ReceptionistMatrix />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="store" element={<ProductStore />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
