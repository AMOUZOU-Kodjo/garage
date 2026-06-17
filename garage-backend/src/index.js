require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', routes);

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
