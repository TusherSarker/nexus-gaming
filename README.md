# 🎮 NEXUS GAMING — Next-Gen Esports & Digital Gaming Storefront

> **Built with [Google Antigravity](https://deepmind.google/technologies/) AI Coding Assistant**  
> A high-performance, full-stack digital gaming store and administrative commerce ecosystem engineered for instant game credits, battle passes, subscriptions, and tournament gear.

---

## 🌟 Overview & Antigravity Showcase

Nexus Gaming is a production-grade full-stack web application designed and pair-programmed from scratch using **Google Antigravity**. It features a modern, fluid cyberpunk aesthetic with zero-latency interactions, continuous physics-based 3D scrollytelling, dual-currency transparent pricing, 1000-day persistent authentication, an interactive cart & loadout system, and a comprehensive Admin ERP Dashboard.

### 🤖 Powered by Google Antigravity
This entire project — including frontend client architecture, Express.js REST API, MongoDB database models, auto-seed engines, vector category SVG emblems, and admin portal — was built and iterated collaboratively using the **Google Antigravity AI pair programming assistant**.

---

## 🚀 Key Features

### 1. 🎯 20 Popular Gaming Categories & Official Vector Emblems
- Features authentic vector logos for the world's most played games:
  - **PUBG Mobile** (Spetsnaz Level 3 Helmet & UC Packs)
  - **Call of Duty: Mobile** (Ghost Skull & CP Vaults)
  - **eFootball** (Speed Sphere & Coins)
  - **Free Fire** (Dragon Flame Dagger & Diamonds)
  - **Mobile Legends: Bang Bang** (Celestial Crest & Starlight)
  - **Valorant**, **Fortnite**, **League of Legends**, **Apex Legends**, **Genshin Impact**, **Roblox**, **Minecraft**, **Clash of Clans**, **Brawl Stars**, **EA Sports FC Mobile**, **Counter-Strike 2**, **GTA Online**, **Overwatch 2**, **Rocket League**, **COD: Warzone**.
- **1-Row Initial View with "See More" Toggle**: Clean 1-row layout on homepage with an interactive expand/collapse button revealing all 20 games smoothly.

### 2. 💎 Apple & Samsung Style 3D Physics Scrollytelling
- Continuous lerp-interpolated physics engine (60/120 FPS) that rotates, zooms, and inspects product cards and digital pass verification stages on scroll.
- Macro optical inspection, in-game Player UID verification, interactive hot-spots, and telemetry HUD overlays.

### 3. 💳 60% All-Inclusive Transparent Pricing Engine
- Highlights all 4 fundamental costs with full fiscal transparency:
  1. **Dual-Currency Card & Bank Foreign Exchange Fees (+18%)**
  2. **Government VAT & Digital Goods Tax (+15%)**
  3. **High-Availability Cloud Server Infrastructure (+12%)**
  4. **Support Staff Living Wages & Instant 2-5m Dispatch (+15%)**
- Clean whole-integer prices ($100 Base $\rightarrow$ $160 All-Inclusive) with **zero hidden checkout fees**.

### 4. 🔒 1000-Day Persistent Zero-Password Authentication
- Permanent local auth synchronization that remembers users even across browser restarts, laptop reboots, or 1000 days offline without logging them out.
- Profile dashboard allowing players to update their Gamer Tag, In-Game UID, Email, and Phone with high-contrast, accessible form controls.

### 5. 🛡️ Comprehensive Admin Portal (`/admin/`)
- Protected admin dashboard with real-time stats (Revenue, Orders, Products, Users).
- Complete CRUD controls for Products, Categories, Orders, Subscriptions, and User Roles.
- Clean starting baseline with $0 starting revenue awaiting real customer deployment.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Vanilla HTML5 / ES6 Modules + Vite 8 |
| **Styling & Design** | TailwindCSS v3 + Custom HSL Design Tokens + Glassmorphism |
| **Icons & Typography** | Lucide Icons + Google Fonts (Rajdhani, Inter, JetBrains Mono) |
| **Backend Framework** | Node.js + Express.js REST API |
| **Database** | MongoDB with Mongoose (Dual Mode: MongoDB Atlas + Embedded In-Memory MongoDB) |
| **Security & Auth** | JWT Tokens, BcryptJS password hashing, CORS, Helmet, Mongo Sanitize |

---

## 📦 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/nexus-gaming.git
cd nexus-gaming
```

### 2. Install dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 3. Start the application
```bash
# Terminal 1: Start full-stack Express & MongoDB backend server
node server/server.js

# Terminal 2: Start Vite client dev server
npm run dev
```

Open your browser at:
- 🎮 **Storefront**: [http://localhost:5000/](http://localhost:5000/) or [http://localhost:5173/](http://localhost:5173/)
- 🛡️ **Admin Portal**: [http://localhost:5000/admin/](http://localhost:5000/admin/)  
  *(Default Admin: `admin@nexusgaming.com` / `admin123`)*
- ⚡ **REST API**: [http://localhost:5000/api/](http://localhost:5000/api/)

---

## 🌐 Free 1-Click Hosting & Showcase Options

### Option A: Render.com (Recommended for Full-Stack)
1. Push this repo to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New Web Service**.
3. Select your `nexus-gaming` repository.
4. Set **Build Command**: `npm run build && cd server && npm install`
5. Set **Start Command**: `node server/server.js`
6. Render will provide a free live HTTPS URL (e.g. `https://nexus-gaming.onrender.com`) to share with friends!

### Option B: Instant Local Tunnel (Share with friends right now!)
You can share your running server with friends immediately without deploying:
```bash
npx localtunnel --port 5000
```
This generates a secure public URL (e.g. `https://nexus-gaming-demo.loca.lt`) accessible from anywhere!

---

## 📄 License
MIT License. Created with ❤️ and **Google Antigravity**.
