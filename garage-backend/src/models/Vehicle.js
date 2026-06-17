const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  marque: { type: DataTypes.STRING, allowNull: false },
  modele: { type: DataTypes.STRING, allowNull: false },
  annee: { type: DataTypes.INTEGER },
  immatriculation: { type: DataTypes.STRING, allowNull: false, unique: true },
  vin: { type: DataTypes.STRING },
  kilometrage: { type: DataTypes.INTEGER },
  statut: {
    type: DataTypes.ENUM('en_attente', 'en_cours', 'reparé', 'libéré'),
    defaultValue: 'en_attente',
  },
  description_panne: { type: DataTypes.TEXT },
  date_entree: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date_sortie: { type: DataTypes.DATE },
});

module.exports = Vehicle;
