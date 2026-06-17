require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const routes = require('./routes');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.CORS_ORIGIN || '';
    const list = allowed.split(',').map(s => s.trim()).filter(Boolean);
    if (!origin || list.length === 0 || list.includes(origin) || list.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', routes);
app.use('/api/public', publicRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Garage Management API' });
});

const start = async () => {
  try {
    require('./models');
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error);
  }
};

start();
