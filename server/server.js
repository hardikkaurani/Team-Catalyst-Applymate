const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');

// Load environment variables from .env in root or server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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

// Basic Route
app.get('/', (req, res) => {
  res.send('ApplyMate Server is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
