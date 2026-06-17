const { Vehicle, User, Repair, Client } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.summary = async (req, res) => {
  try {
    const total_vehicules = await Vehicle.count();
    const total_repairs = await Repair.count();
    const vehicules_libres = await Vehicle.count({ where: { statut: 'libéré' } });

    const couts = await Repair.findAll({
      attributes: [
        [fn('SUM', col('cout_main_oeuvre')), 'total_main_oeuvre'],
        [fn('SUM', col('montant_pieces')), 'total_pieces'],
        [fn('SUM', col('montant_total')), 'total_general'],
      ],
      raw: true,
    });

    const revenu_total = parseFloat(couts[0]?.total_general || 0);
    const main_oeuvre_total = parseFloat(couts[0]?.total_main_oeuvre || 0);
    const pieces_total = parseFloat(couts[0]?.total_pieces || 0);

    const top_mecaniciens = await Repair.findAll({
      attributes: [
        'mecanicien_id',
        [fn('COUNT', col('id')), 'total_reparations'],
        [fn('SUM', col('montant_total')), 'total_gagne'],
      ],
      include: [{ model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] }],
      group: ['mecanicien_id', 'mecanicien.id'],
      order: [[literal('total_gagne'), 'DESC']],
      raw: true,
      nest: true,
    });

    res.json({
      revenu_total,
      main_oeuvre_total,
      pieces_total,
      total_vehicules,
      total_repairs,
      vehicules_libres,
      top_mecaniciens: top_mecaniciens.map(m => ({
        id: m.mecanicien_id,
        nom: `${m.mecanicien?.prenom || ''} ${m.mecanicien?.nom || ''}`,
        reparations: parseInt(m.total_reparations),
        total_gagne: parseFloat(m.total_gagne || 0),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
