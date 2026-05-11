require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

db.query('SELECT 1')
  .then(() => {
    console.log('✅ MySQL Connected');
  })
  .catch((err) => {
    console.error('❌ MySQL Connection Failed:', err);
  });

app.get('/', (req, res) => {
  res.send('API Sistem Pendukung Keputusan Rhizobium Ready!');
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: false,
    message: 'Internal server error',
  });
});

module.exports = app;
