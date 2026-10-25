require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  Express server running on http://localhost:${PORT}`);
    console.log(`📡  Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖  AI service  : ${process.env.AI_SERVICE_URL || 'http://localhost:8000'}\n`);
  });
}).catch((err) => {
  console.error('❌  Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
