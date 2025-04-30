import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import protect from './middleware/auth.js';
import answerRoutes from './routes/answers.js';

// Load environment variables first
dotenv.config();

// Initialize Express
const app = express();

// Configure CORS with enhanced development handling
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://your-production-domain.com' // Add production domains
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins and log access in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Allowing origin: ${origin}`);
      return callback(null, true);
    }

    // Production: Validate against allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Connect to MongoDB
connectDB();

// Body parser middleware
app.use(express.json());

// Development-only request logger
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name,
      host: mongoose.connection.host
    }
  });
});

// Protected route
app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}`,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Start server
mongoose.connection.once('open', () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`API:   http://localhost:${PORT}/api/health`);
    console.log(`DB:    ${mongoose.connection.host}`);
    console.log('CORS Configuration:');
    console.log(`- Mode: ${process.env.NODE_ENV === 'production' ? 'Strict' : 'Development (All origins allowed)'}`);
  });
});