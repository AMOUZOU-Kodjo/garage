const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING },
  vehicule: { type: DataTypes.STRING },
  texte: { type: DataTypes.TEXT, allowNull: false },
  note: { type: DataTypes.INTEGER, defaultValue: 5, validate: { min: 1, max: 5 } },
  actif: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Testimonial;
