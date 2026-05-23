// src/utils/storage.js
import { INITIAL_USERS, INITIAL_PROPERTIES } from '../data/mockData';

const KEYS = {
  USERS: 'ev_users',
  PROPERTIES: 'ev_properties',
  WISHLIST: 'ev_wishlist',
  CURRENT_USER: 'ev_current_user',
};

// ─── Seed ────────────────────────────────────────────────────────────────────

export function seedData() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.PROPERTIES)) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
  }
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify([]));
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function getUsers() {
  return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
}

export function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser() {
  const u = localStorage.getItem(KEYS.CURRENT_USER);
  return u ? JSON.parse(u) : null;
}

export function setCurrentUser(user) {
  if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  else localStorage.removeItem(KEYS.CURRENT_USER);
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);
  return newUser;
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password.');
  const { password: _, ...safeUser } = user;
  setCurrentUser(safeUser);
  return safeUser;
}

export function logoutUser() {
  setCurrentUser(null);
}

export function deleteUser(userId) {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
  // Remove user properties
  const props = getProperties().filter(p => p.userId !== userId);
  saveProperties(props);
  // Remove user wishlist
  const wishlist = getWishlist().filter(w => w.userId !== userId);
  saveWishlist(wishlist);
}

// ─── Properties ──────────────────────────────────────────────────────────────

export function getProperties() {
  return JSON.parse(localStorage.getItem(KEYS.PROPERTIES)) || [];
}

export function saveProperties(properties) {
  localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
}

export function getPropertyById(id) {
  return getProperties().find(p => p.id === id) || null;
}

export function addProperty(data) {
  const properties = getProperties();
  const newProp = {
    ...data,
    id: `prop-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  saveProperties([...properties, newProp]);
  return newProp;
}

export function updateProperty(id, updates) {
  const properties = getProperties().map(p =>
    p.id === id ? { ...p, ...updates } : p
  );
  saveProperties(properties);
  return properties.find(p => p.id === id);
}

export function deleteProperty(id) {
  saveProperties(getProperties().filter(p => p.id !== id));
  saveWishlist(getWishlist().filter(w => w.propertyId !== id));
}

export function approveProperty(id) {
  return updateProperty(id, { status: 'approved' });
}

export function rejectProperty(id) {
  return updateProperty(id, { status: 'rejected' });
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export function getWishlist() {
  return JSON.parse(localStorage.getItem(KEYS.WISHLIST)) || [];
}

export function saveWishlist(wishlist) {
  localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
}

export function getUserWishlist(userId) {
  const wishlist = getWishlist().filter(w => w.userId === userId);
  const properties = getProperties();
  return wishlist
    .map(w => ({ ...w, property: properties.find(p => p.id === w.propertyId) }))
    .filter(w => w.property);
}

export function isInWishlist(userId, propertyId) {
  return getWishlist().some(w => w.userId === userId && w.propertyId === propertyId);
}

export function addToWishlist(userId, propertyId) {
  if (isInWishlist(userId, propertyId)) return;
  const entry = { id: `wish-${Date.now()}`, userId, propertyId };
  saveWishlist([...getWishlist(), entry]);
}

export function removeFromWishlist(userId, propertyId) {
  saveWishlist(getWishlist().filter(w => !(w.userId === userId && w.propertyId === propertyId)));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
