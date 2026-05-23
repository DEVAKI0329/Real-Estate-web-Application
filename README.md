# EstateVault — Real Estate Platform

A full-featured React.js frontend for a real estate platform with Customer and Admin roles, localStorage persistence, protected routing, and a premium UI.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 16
- npm or yarn

### Installation & Run

```bash
# 1. Extract the ZIP and navigate into the folder
cd real-estate-platform

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role     | Email                     | Password   |
|----------|---------------------------|------------|
| Admin    | admin@estatevault.com     | admin123   |
| Customer | sarah@example.com         | password123|
| Customer | james@example.com         | password123|

> On the Login page, use the **Quick fill** buttons to auto-populate credentials.

---

## 📁 Folder Structure

```
real-estate-platform/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx               # Entry point
    ├── App.jsx                # Router + providers
    ├── index.css              # Global design system
    │
    ├── data/
    │   └── mockData.js        # Seed data (users, properties, images)
    │
    ├── utils/
    │   ├── storage.js         # All localStorage CRUD operations
    │   ├── AuthContext.jsx    # Auth state provider
    │   └── ToastContext.jsx   # Toast notification provider
    │
    ├── components/
    │   ├── Navbar.jsx / .css
    │   ├── Footer.jsx / .css
    │   ├── PropertyCard.jsx / .css
    │   ├── ProtectedRoute.jsx
    │   ├── SearchBar.jsx / .css
    │   └── Filter.jsx / .css
    │
    └── pages/
        ├── Home.jsx / .css
        ├── Login.jsx
        ├── Register.jsx
        ├── Auth.css           # Shared auth styles
        ├── PropertyDetails.jsx / .css
        ├── Wishlist.jsx
        ├── AddProperty.jsx
        ├── EditProperty.jsx
        ├── PropertyForm.css   # Shared form styles
        ├── MyProperties.jsx / .css
        └── admin/
            ├── Admin.css      # Shared admin styles
            ├── AdminDashboard.jsx
            ├── Customers.jsx
            ├── Properties.jsx
            └── PendingProperties.jsx / .css
```

---

## 🛣️ Routes

| Path                  | Page                | Access     |
|-----------------------|---------------------|------------|
| `/`                   | Home (Listings)     | Public     |
| `/login`              | Login               | Public     |
| `/register`           | Register            | Public     |
| `/property/:id`       | Property Details    | Public     |
| `/wishlist`           | Wishlist            | Customer   |
| `/add-property`       | Add Property        | Customer   |
| `/edit-property/:id`  | Edit Property       | Customer   |
| `/my-properties`      | My Properties       | Customer   |
| `/admin`              | Admin Dashboard     | Admin      |
| `/admin/customers`    | Manage Customers    | Admin      |
| `/admin/properties`   | Manage Properties   | Admin      |
| `/admin/pending`      | Pending Review      | Admin      |

---

## 🗃️ Data Structures (localStorage)

### User
```json
{
  "id": "user-001",
  "name": "Sarah Mitchell",
  "email": "sarah@example.com",
  "password": "password123",
  "role": "customer",
  "createdAt": "2024-02-10T10:00:00.000Z"
}
```

### Property
```json
{
  "id": "prop-001",
  "title": "Modern Villa in Bandra",
  "description": "A stunning 4-bedroom villa...",
  "price": 25000000,
  "location": "Bandra West, Mumbai",
  "type": "villa",
  "image": "https://...",
  "ownerName": "Sarah Mitchell",
  "ownerContact": "+91 9876543210",
  "status": "approved",
  "userId": "user-001",
  "bedrooms": 4,
  "bathrooms": 5,
  "area": 4200,
  "createdAt": "2024-03-10T09:00:00.000Z"
}
```

### Wishlist Entry
```json
{
  "id": "wish-1234567890",
  "userId": "user-001",
  "propertyId": "prop-002"
}
```

### localStorage Keys
| Key              | Contents             |
|------------------|----------------------|
| `ev_users`       | Array of users       |
| `ev_properties`  | Array of properties  |
| `ev_wishlist`    | Array of wishlist entries |
| `ev_current_user`| Currently logged-in user object |

---

## ✨ Features

### Customer
- Register / Login / Logout
- Browse all approved property listings
- Search by location, title, or type
- Filter by property type and price range
- Sort by newest / price
- View full property details
- Add / remove from wishlist
- Add new property (submitted for review)
- Edit own property (re-submitted for review)
- Delete own property
- View all own listings with status

### Admin
- Dedicated admin login
- Dashboard with stats (counts, portfolio value)
- View and delete customers
- View all properties with search + status filter
- Approve / reject / delete any property
- Dedicated pending review queue with full card view

---

## 🔧 Resetting Data

To reset all data to the initial seed state, open your browser DevTools console and run:

```javascript
localStorage.clear();
location.reload();
```

---

## 🏗️ Tech Stack

- **React 18** — Functional components + hooks
- **React Router DOM v6** — Client-side routing + protected routes
- **Vite** — Dev server + bundler
- **Pure CSS** — Custom design system with CSS variables
- **localStorage** — Client-side data persistence
- **Google Fonts** — Playfair Display + DM Sans

---

## 📦 Build for Production

```bash
npm run build
# Output in /dist folder
npm run preview  # Preview the production build locally
```
