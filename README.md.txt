# 🏝️ Resort Web App (React + Node.js + PostgreSQL)

A dynamic resort management web application built with **React** for the frontend, **Node.js/Express** for the backend, and **PostgreSQL** as the database.  
Designed to be **multi-tenant**, so you can sell it to multiple clients (different resorts) with customizable branding and content.

---

## 📂 Project Structure
resort-app/
│
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, RoomCard, DatePicker, Charts
│   │   ├── pages/         # Home, About, Reservation, Gallery, Contact, AdminDashboard
│   │   ├── context/       # ResortContext.js (dynamic data per client)
│   │   ├── hooks/         # Custom hooks (useReservation, useAuth)
│   │   └── App.js
│   └── package.json
│
├── server/                # Node.js backend
│   ├── routes/            # API endpoints (reservations, rooms, users)
│   ├── models/            # PostgreSQL models (Sequelize/Prisma/Knex)
│   ├── controllers/       # Business logic
│   ├── config/            # DB connection
│   └── server.js
│
└── package.json


---

## ⚙️ Tech Stack

- **Frontend**: React + TailwindCSS/Material UI  
- **Backend**: Node.js + Express  
- **Database**: PostgreSQL  
- **ORM Options**: Sequelize / Prisma / Knex  
- **Authentication**: JWT or Auth0  
- **Payments**: Stripe / PayPal  
- **Hosting**: Vercel/Netlify (frontend), AWS/Azure (backend)

---

## 🖥️ Pages

- **[Homepage](ca://s?q=Resort_homepage_in_React)** → Hero section, highlights, CTA  
- **[About](ca://s?q=Resort_about_page_in_React)** → Resort info, facilities  
- **[Reservation](ca://s?q=Resort_reservation_page_in_React)** → Booking form with **date-time picker**, room selection, payment integration  
- **[Gallery](ca://s?q=Resort_gallery_page_in_React)** → Photo carousel, video tours  
- **[Contact](ca://s?q=Resort_contact_page_in_React)** → Form, map, quick inquiry chat  
- **[Admin Dashboard](ca://s?q=Resort_admin_dashboard_in_React)** → CRUD for rooms, pricing, promotions, analytics with charts

---

## 🗄️ Database Schema (PostgreSQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'guest'
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  availability BOOLEAN DEFAULT true,
  image_url TEXT
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  room_id INT REFERENCES rooms(id),
  check_in TIMESTAMP,
  check_out TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);
