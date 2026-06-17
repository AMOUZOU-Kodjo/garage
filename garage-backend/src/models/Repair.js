const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Repair = sequelize.define('Repair', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  panne_constatee: { type: DataTypes.TEXT },
  solution_appliquee: { type: DataTypes.TEXT },
  outils_utilises: { type: DataTypes.TEXT },
  duree_intervention: { type: DataTypes.INTEGER },
  cout_main_oeuvre: { type: DataTypes.DECIMAL(10, 2) },
  montant_pieces: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  montant_total: { type: DataTypes.DECIMAL(10, 2) },
  notes: { type: DataTypes.TEXT },
  date_intervention: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Repair;
