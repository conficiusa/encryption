require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Database
const connectDB = require('./config/database');
const { connectSecureClient } = require('./utils/encryptionClient');

// Routes
const userRoutes = require('./routes/encryption.routes');

// Middleware
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateToken = require('./middleware/auth.middleware');

const app = express();

// Allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.ALLOWED_ORIGIN, 'https://your-app-name.vercel.app'] // Add your Vercel domain
  : [process.env.ALLOWED_ORIGIN, 'http://localhost:3000'];

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 100 requests per windowMs
    message: 'You have been rate limited, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

// Request Parsers
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: false }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply authentication middleware to all routes
app.use(authenticateToken);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// API Routes
app.use('/api/encryption', userRoutes); 

// Error Handler
app.use(errorHandlerMiddleware);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();