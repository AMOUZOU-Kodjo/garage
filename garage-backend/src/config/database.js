const { Sequelize } = require('sequelize');
const path = require('path');

const isPostgres = !!process.env.DATABASE_URL;

const sequelize = isPostgres
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', '..', 'database.sqlite'),
      logging: false,
    });

module.exports = sequelize;
