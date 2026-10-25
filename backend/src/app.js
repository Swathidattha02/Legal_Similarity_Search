const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const researchRoutes = require('./routes/researchRoutes');
const savedCasesRoutes = require('./routes/savedCasesRoutes');
const historyRoutes = require('./routes/historyRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();

// ── Security headers
app.use(helmet());

// ── CORS — only allow the configured frontend origin
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging (concise in production)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Static file serving for uploaded documents
// Files are served at /uploads/<filename> but stored on disk under backend/uploads/
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health check — no authentication required
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'legal-research-api',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/research', researchRoutes);
app.use('/api/v1/saved-cases', savedCasesRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/documents', documentRoutes);

// ── 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Centralised error handler (must be last)
app.use(errorHandler);

module.exports = app;
