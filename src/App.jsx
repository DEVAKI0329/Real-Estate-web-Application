// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ToastProvider } from './utils/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import Wishlist from './pages/Wishlist';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import MyProperties from './pages/MyProperties';

import AdminDashboard from './pages/admin/AdminDashboard';
import Customers from './pages/admin/Customers';
import Properties from './pages/admin/Properties';
import PendingProperties from './pages/admin/PendingProperties';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/property/:id" element={<PropertyDetails />} />

            {/* Customer Protected */}
            <Route path="/wishlist" element={
              <ProtectedRoute role="customer"><Wishlist /></ProtectedRoute>
            } />
            <Route path="/add-property" element={
              <ProtectedRoute role="customer"><AddProperty /></ProtectedRoute>
            } />
            <Route path="/edit-property/:id" element={
              <ProtectedRoute role="customer"><EditProperty /></ProtectedRoute>
            } />
            <Route path="/my-properties" element={
              <ProtectedRoute role="customer"><MyProperties /></ProtectedRoute>
            } />

            {/* Admin Protected */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
              <ProtectedRoute role="admin"><Customers /></ProtectedRoute>
            } />
            <Route path="/admin/properties" element={
              <ProtectedRoute role="admin"><Properties /></ProtectedRoute>
            } />
            <Route path="/admin/pending" element={
              <ProtectedRoute role="admin"><PendingProperties /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
