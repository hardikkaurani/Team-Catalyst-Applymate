const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const companyRoutes = require('./routes/company.routes');
const resourceRoutes = require('./routes/resource.routes');
const journalRoutes = require('./routes/journal.routes');
const timelineRoutes = require('./routes/timeline.routes');
const actionRoutes = require('./routes/action.routes');
const insightRoutes = require('./routes/insight.routes');

// Load environment variables from .env in root or server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes Integration
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/insights', insightRoutes);

// MongoDB Connection
const MONGO_URI = process.env.DATABASE_URL || process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Error: MongoDB connection string not found in environment variables.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB successfully.');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('ApplyMate Server is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
