import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import MissingPersonDetails from './pages/MissingPersonDetails';
import CaseManagement from './pages/CaseManagement';
import ProfilePage from './pages/user/ProfilePage';

const AppRoutes = () => (
  // <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/missing-person" element={<MissingPersonDetails />} />
      <Route path="/case-management" element={<CaseManagement />} />
    </Routes>
  // </Router>
);

export default AppRoutes;