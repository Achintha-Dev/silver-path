import dns from 'dns';
// fix DNS resolution issues by using public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoute.js';
import destinationRoutes from './routes/destinationsRoute.js';

dotenv.config();


const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiting middleware
app.use('/api/', apiLimiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);

// 404 Handler (unknown routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Global Error Handler 
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
})


connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit with failure code
});