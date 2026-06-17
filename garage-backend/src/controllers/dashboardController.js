const { Vehicle, User, Repair, Reservation, Client } = require('../models');
const { Op } = require('sequelize');

exports.receptionniste = async (req, res) => {
  const aujourdhui = new Date().toISOString().split('T')[0];
  const [en_attente, reservations_jour, en_cours, pret] = await Promise.all([
    Vehicle.count({ where: { statut: 'en_attente' } }),
    Reservation.count({ where: { date_reservation: aujourdhui, statut: { [Op.ne]: 'annulé' } } }),
    Vehicle.count({ where: { statut: 'en_cours' } }),
    Vehicle.count({ where: { statut: 'reparé' } }),
  ]);
  res.json({ en_attente, reservations_jour, en_cours, pret });
};

exports.mecanicien = async (req, res) => {
  const [assignes, en_cours, historique, rendezvous] = await Promise.all([
    Vehicle.count({ where: { mecanicien_id: req.user.id, statut: { [Op.in]: ['en_attente', 'en_cours'] } } }),
    Vehicle.count({ where: { mecanicien_id: req.user.id, statut: 'en_cours' } }),
    Repair.count({ where: { mecanicien_id: req.user.id } }),
    Reservation.count({ where: { mecanicien_id: req.user.id, statut: { [Op.in]: ['en_attente', 'confirmé'] } } }),
  ]);
  res.json({ assignes, en_cours, historique, rendezvous });
};

exports.directeur = async (req, res) => {
  const [total_vehicules, total_mecaniciens, total_clients, total_reparations, stats_mecaniciens] = await Promise.all([
    Vehicle.count(),
    User.count({ where: { role: 'mecanicien', actif: true } }),
    Client.count(),
    Repair.count(),
    User.findAll({
      where: { role: 'mecanicien', actif: true },
      attributes: ['id', 'nom', 'prenom'],
      include: [
        { model: Repair, as: 'reparations', attributes: ['id'] },
        { model: Vehicle, as: 'vehicules_assignes', attributes: ['id', 'statut'] },
      ],
    }),
  ]);

  const stats = stats_mecaniciens.map(m => ({
    id: m.id,
    nom: `${m.prenom} ${m.nom}`,
    reparations: m.reparations.length,
    en_cours: m.vehicules_assignes.filter(v => v.statut === 'en_cours').length,
  }));

  const statuts = await Vehicle.findAll({
    attributes: ['statut', [require('sequelize').fn('COUNT', 'statut'), 'count']],
    group: ['statut'],
  });

  res.json({ total_vehicules, total_mecaniciens, total_clients, total_reparations, stats_mecaniciens: stats, statuts });
};
