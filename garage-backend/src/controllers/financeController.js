const { Vehicle, User, Repair } = require('../models');
const { fn, col } = require('sequelize');

exports.summary = async (req, res) => {
  try {
    const [total_vehicules, total_repairs, vehicules_libres, couts, mecaniciens] = await Promise.all([
      Vehicle.count(),
      Repair.count(),
      Vehicle.count({ where: { statut: 'libéré' } }),
      Repair.findOne({
        attributes: [
          [fn('COALESCE', fn('SUM', col('cout_main_oeuvre')), 0), 'total_main_oeuvre'],
          [fn('COALESCE', fn('SUM', col('montant_pieces')), 0), 'total_pieces'],
          [fn('COALESCE', fn('SUM', col('montant_total')), 0), 'total_general'],
        ],
        raw: true,
      }),
      User.findAll({ where: { role: 'mecanicien', actif: true }, attributes: ['id', 'nom', 'prenom'], raw: true }),
    ]);

    const revenu_total = parseFloat(couts?.total_general || 0);
    const main_oeuvre_total = parseFloat(couts?.total_main_oeuvre || 0);
    const pieces_total = parseFloat(couts?.total_pieces || 0);

    const topMecaniciens = [];

    for (const m of mecaniciens) {
      const stats = await Repair.findAll({
        where: { mecanicien_id: m.id },
        attributes: [
          [fn('COUNT', col('id')), 'total_reparations'],
          [fn('COALESCE', fn('SUM', col('montant_total')), 0), 'total_gagne'],
        ],
        raw: true,
      });
      topMecaniciens.push({
        id: m.id,
        nom: `${m.prenom || ''} ${m.nom || ''}`,
        reparations: parseInt(stats[0]?.total_reparations || 0),
        total_gagne: parseFloat(stats[0]?.total_gagne || 0),
      });
    }

    topMecaniciens.sort((a, b) => b.total_gagne - a.total_gagne);

    res.json({
      revenu_total,
      main_oeuvre_total,
      pieces_total,
      total_vehicules,
      total_repairs,
      vehicules_libres,
      top_mecaniciens: topMecaniciens,
    });
  } catch (error) {
    console.error('Finance error:', error);
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
