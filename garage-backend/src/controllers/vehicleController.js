const { Vehicle, Client, User, Repair } = require('../models');

const sanitizeInt = (v) => (v === '' || v === undefined || v === null ? null : parseInt(v));
const sanitizeFloat = (v) => (v === '' || v === undefined || v === null ? null : parseFloat(v));

const sanitizeVehicle = (body) => ({
  ...body,
  annee: sanitizeInt(body.annee),
  kilometrage: sanitizeInt(body.kilometrage),
  client_id: body.client_id ? parseInt(body.client_id) : null,
  mecanicien_id: body.mecanicien_id ? parseInt(body.mecanicien_id) : null,
});

exports.index = async (req, res) => {
  const where = {};
  if (req.query.statut) where.statut = req.query.statut;
  if (req.user.role === 'mecanicien') where.mecanicien_id = req.user.id;

  const vehicles = await Vehicle.findAll({
    where,
    include: [
      { model: Client, as: 'client' },
      { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.json(vehicles);
};

exports.show = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id, {
    include: [
      { model: Client, as: 'client' },
      { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
      { model: Repair, as: 'reparation' },
    ],
  });
  if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
  res.json(vehicle);
};

exports.store = async (req, res) => {
  const vehicle = await Vehicle.create(sanitizeVehicle(req.body));
  res.status(201).json(vehicle);
};

exports.update = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
  await vehicle.update(sanitizeVehicle(req.body));
  res.json(vehicle);
};

exports.assign = async (req, res) => {
  const { mecanicien_id } = req.body;
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
  const mecanicien = await User.findByPk(mecanicien_id);
  if (!mecanicien || mecanicien.role !== 'mecanicien') {
    return res.status(400).json({ message: 'Mécanicien invalide' });
  }
  await vehicle.update({ mecanicien_id, statut: 'en_cours' });
  res.json(vehicle);
};

exports.liberer = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id, {
    include: [{ model: Repair, as: 'reparation' }],
  });
  if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });

  const { cout_main_oeuvre, montant_pieces, montant_total } = req.body;

  if (vehicle.reparation && (cout_main_oeuvre || montant_pieces || montant_total)) {
    await vehicle.reparation.update({
      cout_main_oeuvre: cout_main_oeuvre ?? vehicle.reparation.cout_main_oeuvre,
      montant_pieces: montant_pieces ?? vehicle.reparation.montant_pieces,
      montant_total: montant_total ?? (parseFloat(cout_main_oeuvre || vehicle.reparation.cout_main_oeuvre || 0) + parseFloat(montant_pieces || vehicle.reparation.montant_pieces || 0)),
    });
  }

  await vehicle.update({ statut: 'libéré', date_sortie: new Date() });
  res.json(vehicle);
};

exports.destroy = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });
  await vehicle.destroy();
  res.json({ message: 'Véhicule supprimé' });
};
