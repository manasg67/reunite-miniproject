import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import MissingPersonDetails from './pages/admin/MissingPersonDetails';
import CaseManagement from './pages/admin/CaseManagement';

const AppRoutes = () => (
  // <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/missing-person" element={<MissingPersonDetails />} />
      <Route path="/case-management" element={<CaseManagement />} />
    </Routes>
  // </Router>
);

export default AppRoutes;