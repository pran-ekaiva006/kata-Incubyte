import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import sweetRoutes from './routes/sweetRoutes.js';

const app = express();

// CORS Configuration - MUST be before other middleware

const corsOptions = {
  origin: [
    'http://localhost:3000', // frontend
    'http://localhost:5000', // backend (if you test APIs directly)
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

export default app;
