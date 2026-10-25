/**
 * Centralised error handler.
 * Must be registered as the LAST middleware in app.js.
 */
const errorHandler = (err, req, res, _next) => {
  // Log internally (exclude file content to avoid leaking uploaded docs)
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
  }

  // Mongoose duplicate key (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already in use` });
  }

  // Multer errors (file type, size)
  if (err.name === 'MulterError' || err.message === 'Only PDF files are accepted') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // JWT errors (caught in auth middleware — should not reach here, but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  // Default — do not expose internal stack trace to clients
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'An unexpected error occurred';
  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
