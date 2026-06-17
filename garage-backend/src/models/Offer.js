const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offer = sequelize.define('Offer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titre: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  remise: { type: DataTypes.DECIMAL(5, 2) },
  date_debut: { type: DataTypes.DATEONLY },
  date_fin: { type: DataTypes.DATEONLY },
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Offer;
