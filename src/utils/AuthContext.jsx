// src/utils/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, seedData } from './storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedData();
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateUser = (u) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
