const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { ENV, RATE_LIMIT } = require('./config/constants');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const ngoRoutes = require('./routes/ngo');
const eventRoutes = require('./routes/event');
const donationRoutes = require('./routes/donation');
const paymentRoutes = require('./routes/payment');
const volunteerProfileRoutes = require('./routes/volunteerProfile');
const errorHandler = require('./middleware/errorMiddleware');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: ENV.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: ENV.NODE_ENV === 'production'
}));

// CORS configuration
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development only)
if (ENV.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// ================= RATE LIMITERS =================

// General API limiter
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// ================= APPLY MIDDLEWARE =================

// ✅ Apply rate limiting ONLY in production
if (ENV.NODE_ENV === 'production') {
  app.use('/api/', apiLimiter);
  app.use('/api/auth', authLimiter, authRoutes);
} else {
  // ❌ No rate limiting in development
  app.use('/api/auth', authRoutes);
}

// Other routes (no limiter in dev)
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/donate', donationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/volunteer', volunteerProfileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = ENV.PORT;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('✅ HTTP server closed');

    try {
      console.log('🔄 Closing database connections...');
      console.log('✅ Graceful shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during shutdown:', err.message);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('⚠️  Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION!');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION!');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
