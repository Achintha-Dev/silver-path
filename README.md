# 🌍 Silver Path
### Local Tourist Day-Visit Planner and Information System

**Academic Project | Faculty of Information Technology | University of Moratuwa**

---

## 📌 Overview

Silver Path is a full-stack MERN (MongoDB, Express, React, Node.js) web application built to promote local tourism in the **Rideegama region, Sri Lanka**.

It provides a centralized platform for discovering and managing tourist destinations within a **25 km radius**. Users can explore locations, view detailed information, and plan efficient one-day visits.

---

## 🎯 Objectives

- **Centralized Information**: Provide reliable and up-to-date tourist data
- **Efficient Planning**: Enable users to explore destinations within a 25 km radius  
- **Itinerary Support**: Assist in one-day visit planning
- **Content Management**: Allow admins to manage destinations securely

---

## 🏗️ System Architecture

The application follows **MVC (Model-View-Controller)** architecture:

- **Frontend**: React.js SPA with Tailwind CSS
- **Backend**: Node.js + Express.js REST API
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based admin authentication
- **Media**: Cloudinary for image storage

### 🔄 System Flow

User → React Frontend → Express API → MongoDB → API Response → UI Update


---

## ⚙️ Core Features

### 🧭 User Features
- Browse and explore tourist destinations
- Search and filter by category
- View detailed information including description, facilities, and travel tips
- Interactive map using Leaflet

### 🔐 Admin Features
- Secure login using JWT authentication
- Add, update, and delete destinations with full CRUD
- Upload and manage destination images

### ⚡ Technical Highlights
- Geospatial validation within a 25 km radius
- Responsive design for mobile and desktop
- Dynamic data fetching and filtering

---

## 🧰 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React 18, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, Bcrypt.js |
| Media | Cloudinary |
| Maps | Leaflet + OpenStreetMap |

---

## 🚀 Installation and Setup

### 🔧 Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account
- Cloudinary account

### 📁 1. Clone Repository
```bash
git clone https://github.com/Achintha-Dev/silver-path.git
cd SilverPath
```

### 🔐 2. Environment Variables
Create a .env file inside the /server directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

You can use .env.example as a template.

### ▶️ 3. Run Backend

cd server
npm install
npm run dev

### ▶️ 4. Run Frontend

cd client
npm install
npm run dev

---

## 📂 Project Structure

SilverPath/
├── client/                # React frontend
│   ├── src/
|   |   └── components/
|   |       ├── admin
|   |       └── user
│   ├── src/
|   |   └── pages/
|   |       ├── admin
|   |       └── user
│   ├── src/utils
|   └── src/hooks
├── server/
|   ├── src/config 
|   ├── src/middleware               # Express backend
│   ├── src/models
│   ├── src/controllers
│   └── src/routes
├── README.md
└── .env.example

---

## 🧪 Testing
Functional testing was performed for:

Destination CRUD operations
Image upload functionality
Search and filtering
API endpoint responses
Admin authentication

---

## 📸 Screenshots

### Home Page
![Home Page1](screenshots/home-page1.png)
![Home Page2](screenshots/home-page2.png)
![Home Page3](screenshots/home-page3.png)
![Home Page Mobile View](screenshots/home-page-mobile.png)

### Destinations Page
![Destinations Page1](screenshots/destinations-page1.png)
![Destinations Page2](screenshots/destinations-page2.png)
![Destinations Page Mobile View](screenshots/destinations-page-mobile.png)

### Map View
![Map View1](screenshots/map-page.png)
![Map Page Mobile View](screenshots/map-page-mobile.png)

### Plan Visit Page
![Plan Visit Page](screenshots/plan-visit-page1.png)

### Admin Login Page
![Admin Dashboard](screenshots/admin-login-page.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard-page.png)
![Admin Dashboard Mobile View](screenshots/admin-dashboard-page-mobile.png)

### Admin Add Destination
![Admin Add Destination](screenshots/add-destination-page.png)
![Admin Add Destination Mobile View](screenshots/add-destination-page-mobile.png)

### Admin Edit Destination
![Admin Dashboard](screenshots/edit-destination-page.png)

---

## Author
Name: Achintha Bandara
GitHub: https://github.com/Achintha-Dev
University: University of Moratuwa
Module: ITE2953 - Programming Group Project

---

## Live Demo
-- coming soon.

---

## Badges
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/API-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Academic-blue)](#-license)