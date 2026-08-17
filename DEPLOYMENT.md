# 🚀 Nexus Gaming — Deployment Guide

This guide covers deploying the Nexus Gaming Full-Stack E-Commerce platform to production.

---

## 🏗️ Architecture Overview

Nexus Gaming is a complete full-stack web application:
- **Frontend**: High-performance UI built with Vite & TailwindCSS (bundles into `dist/`)
- **Admin Dashboard**: Located in `admin/` with full CRUD interfaces for products, categories, orders, subscriptions, and users
- **Backend API**: Express.js REST API on Node.js in `server/`
- **Database**: MongoDB with Mongoose ODM (embedded in-memory engine fallback + full MongoDB Atlas cloud support)

---

## ⚡ Option 1: One-Click / Single-Server Deployment (Render / Railway / VPS / Heroku)

Because `server.js` automatically serves the compiled frontend bundle (`dist/`), the admin portal (`admin/`), uploaded media, and API endpoints on a single port, the entire app can be deployed as a single Web Service!

### Deployment Steps:

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install --production
   ```

3. **Configure Environment Variables:**
   Create `.env` inside `server/` (or configure in your cloud dashboard):
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/nexus_gaming?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   ```

4. **Start the application:**
   ```bash
   node server.js
   ```

### Cloud Platform Settings (Render / Railway):
- **Build Command:** `npm install && npm run build && cd server && npm install`
- **Start Command:** `node server/server.js`
- **Root Directory:** `.`

---

## 🌐 Option 2: Split Deployment (Vercel Frontend + Render/Railway Backend)

### Backend:
1. Deploy `server/` to Render/Railway.
2. Set `CLIENT_URL=https://your-frontend.vercel.app`.

### Frontend:
1. Deploy root to Vercel.
2. Set Vite output directory to `dist`.
3. In `src/cart.js` and `admin/js/api.js`, point `BASE_URL` to your live backend domain if separated.

---

## 🔑 Default Admin Account
When connected to a fresh database for the first time, the server automatically seeds the initial dataset:
- **Email:** `admin@nexusgaming.com`
- **Password:** `admin123`

---

## 🛡️ Pre-Flight Verification Checklist
- [x] Production build passes (`npm run build` generates `dist/`)
- [x] All 8 product images exist and copy to `dist/products/`
- [x] REST API endpoints responding (`/api/products`, `/api/auth/login`, `/api/dashboard/stats`)
- [x] Admin Portal accessible at `/admin/`
- [x] Live cart and subscription checkout functional
- [x] Automatic database seeding on first startup
- [x] Relative path routing configured for any domain or port
