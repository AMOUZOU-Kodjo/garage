const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING, allowNull: false },
  adresse: { type: DataTypes.TEXT },
});

module.exports = Client;
