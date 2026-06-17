const { Repair, Vehicle, User, Reservation } = require('../models');

const sanitizeInt = (v) => (v === '' || v == null ? null : parseInt(v));
const sanitizeFloat = (v) => (v === '' || v == null ? null : parseFloat(v));

const sanitizeRepair = (body) => ({
  ...body,
  duree_intervention: sanitizeInt(body.duree_intervention),
  cout_main_oeuvre: sanitizeFloat(body.cout_main_oeuvre),
  montant_pieces: sanitizeFloat(body.montant_pieces),
  montant_total: sanitizeFloat(body.montant_total),
  vehicule_id: body.vehicule_id ? parseInt(body.vehicule_id) : null,
});

exports.index = async (req, res) => {
  const where = {};
  if (req.user.role === 'mecanicien') where.mecanicien_id = req.user.id;

  const repairs = await Repair.findAll({
    where,
    include: [
      { model: Vehicle, as: 'vehicule', include: [{ model: require('../models/Client'), as: 'client' }] },
      { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(repairs);
};

exports.show = async (req, res) => {
  const repair = await Repair.findByPk(req.params.id, {
    include: [
      { model: Vehicle, as: 'vehicule', include: [{ model: require('../models/Client'), as: 'client' }] },
      { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
    ],
  });
  if (!repair) return res.status(404).json({ message: 'Réparation non trouvée' });
  res.json(repair);
};

exports.store = async (req, res) => {
  const data = { ...sanitizeRepair(req.body), mecanicien_id: req.user.id };
  const repair = await Repair.create(data);
  if (data.vehicule_id) {
    await Vehicle.update({ statut: 'en_cours' }, { where: { id: data.vehicule_id } });
  }
  res.status(201).json(repair);
};

exports.update = async (req, res) => {
  const repair = await Repair.findByPk(req.params.id);
  if (!repair) return res.status(404).json({ message: 'Réparation non trouvée' });
  await repair.update(sanitizeRepair(req.body));
  res.json(repair);
};

exports.marquerRepare = async (req, res) => {
  const repair = await Repair.findByPk(req.params.id);
  if (!repair) return res.status(404).json({ message: 'Réparation non trouvée' });
  await repair.update(req.body);
  if (repair.vehicule_id) {
    await Vehicle.update({ statut: 'reparé' }, { where: { id: repair.vehicule_id } });
  }
  res.json(repair);
};
