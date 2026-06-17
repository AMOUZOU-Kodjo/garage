const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING, unique: true },
  date_reservation: { type: DataTypes.DATEONLY, allowNull: false },
  heure_reservation: { type: DataTypes.TIME, allowNull: false },
  description_probleme: { type: DataTypes.TEXT },
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirmé', 'terminé', 'annulé'),
    defaultValue: 'en_attente',
  },
  source: { type: DataTypes.ENUM('public', 'interne'), defaultValue: 'interne' },
  client_nom: { type: DataTypes.STRING },
  client_prenom: { type: DataTypes.STRING },
  client_telephone: { type: DataTypes.STRING },
  client_email: { type: DataTypes.STRING },
  vehicule_marque: { type: DataTypes.STRING },
  vehicule_modele: { type: DataTypes.STRING },
  vehicule_annee: { type: DataTypes.INTEGER },
  vehicule_immatriculation: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
});

module.exports = Reservation;
