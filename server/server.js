import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from server directory or root directory
const serverEnvPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '../.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

process.env.JWT_SECRET = process.env.JWT_SECRET || 'nexus_gaming_super_secret_jwt_key_2026_production';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
process.env.PORT = process.env.PORT || '5000';

import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import subscriptionRoutes from './routes/subscriptions.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import dashboardRoutes from './routes/dashboard.js';

connectDB();

const app = express();

// Body parsers & utilities
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));
app.use(mongoSanitize());

// Flexible CORS for local dev + production deployment
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folders
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const publicProductsDir = path.join(__dirname, '../public/products');
const distProductsDir = path.join(__dirname, '../dist/products');
if (fs.existsSync(distProductsDir)) {
  app.use('/products', express.static(distProductsDir));
} else if (fs.existsSync(publicProductsDir)) {
  app.use('/products', express.static(publicProductsDir));
}

const publicCategoriesDir = path.join(__dirname, '../public/categories');
const distCategoriesDir = path.join(__dirname, '../dist/categories');
if (fs.existsSync(distCategoriesDir)) {
  app.use('/categories', express.static(distCategoriesDir));
} else if (fs.existsSync(publicCategoriesDir)) {
  app.use('/categories', express.static(publicCategoriesDir));
}

const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Admin Dashboard static files
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve frontend production build if available
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/uploads') || req.path.startsWith('/products') || req.path.startsWith('/categories')) {
      return next();
    }
    if (req.path === '/cart' || req.path === '/cart.html') {
      return res.sendFile(path.join(distPath, 'cart.html'));
    }
    if (req.path === '/user-dashboard' || req.path === '/user-dashboard.html') {
      return res.sendFile(path.join(distPath, 'user-dashboard.html'));
    }
    if (req.path === '/product-details' || req.path === '/product-details.html') {
      return res.sendFile(path.join(distPath, 'product-details.html'));
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Tusher Gaming Full-Stack Server running on port ${PORT}`);
  console.log(`🎮 Storefront:       http://localhost:${PORT}/`);
  console.log(`🛡️ Admin Portal:     http://localhost:${PORT}/admin/`);
  console.log(`⚡ REST API:         http://localhost:${PORT}/api/`);
});
