require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const competitionRoutes = require('./routes/competitionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/competitions', competitionRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'feedants-competition-api'
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Feedants Classical Dance Competition API',
    endpoints: {
      health: 'GET /health',
      competitions: 'GET /api/competitions',
      competitionDetails: 'GET /api/competitions/:id',
      register: 'POST /api/competitions/:id/register',
      submit: 'POST /api/competitions/:id/submit'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server if executed directly
if (require.main === module) {
  connectDB().then(async () => {
    const Competition = require('./models/Competition');
    const count = await Competition.countDocuments();
    if (count === 0) {
      console.log('[Server] Database is empty. Auto-seeding Feedants Classical Dance...');
      const seedData = require('./seed');
      await seedData(false);
    }

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Feedants Competition API running on port ${PORT}`);
      console.log(`📍 Base URL: http://localhost:${PORT}/api/competitions`);
      console.log(`===============================================`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = app;
