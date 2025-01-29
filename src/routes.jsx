import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import MissingPersonDetails from './pages/admin/MissingPersonDetails';
import CaseManagement from './pages/admin/CaseManagement';
import ProfilePage from './pages/user/ProfilePage';
import MyComplains from './pages/user/MyComplains';
import Poster from './pages/user/Poster';

import PublicForum from './pages/PublicForum';
import ReportMissing from './pages/user/ReportMissing';
import MissingPersonMap from './pages/MissingPersonMap';

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
      <Route path="/my-complains" element={<MyComplains />} />
      <Route path="/create-poster/:id" element={<Poster />} />
      <Route path="/public-forum" element={<PublicForum />} />
      <Route path="/report-missing" element={<ReportMissing />} />
      <Route path="/missing-person-map" element={<MissingPersonMap />} />
    </Routes>
  // </Router>
);


export default AppRoutes;