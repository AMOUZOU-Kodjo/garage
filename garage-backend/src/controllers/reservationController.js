const { Reservation, Client, Vehicle, User, Repair } = require('../models');

const generateReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'RES-';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
};

const sanitizeReservation = (body) => ({
  ...body,
  client_id: body.client_id ? parseInt(body.client_id) : null,
  mecanicien_id: body.mecanicien_id ? parseInt(body.mecanicien_id) : null,
  receptionniste_id: body.receptionniste_id ? parseInt(body.receptionniste_id) : null,
});

exports.index = async (req, res) => {
  const where = {};
  if (req.query.statut) where.statut = req.query.statut;
  if (req.query.date) where.date_reservation = req.query.date;
  if (req.user.role === 'mecanicien') where.mecanicien_id = req.user.id;
  if (req.user.role === 'receptionniste') where.receptionniste_id = req.user.id;

  const reservations = await Reservation.findAll({
    where,
    include: [
      { model: Client, as: 'client' },
      { model: Vehicle, as: 'vehicle' },
      { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
      { model: User, as: 'receptionniste', attributes: ['id', 'nom', 'prenom'] },
    ],
    order: [['date_reservation', 'ASC'], ['heure_reservation', 'ASC']],
  });
  res.json(reservations);
};

exports.show = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id, {
    include: [
      { model: Client, as: 'client' },
      { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
      { model: Repair, as: 'reparation' },
    ],
  });
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  res.json(reservation);
};

exports.store = async (req, res) => {
  const data = { ...sanitizeReservation(req.body) };
  if (req.user.role === 'receptionniste') data.receptionniste_id = req.user.id;
  if (!data.reference) {
    let reference;
    let exists = true;
    while (exists) {
      reference = generateReference();
      exists = await Reservation.findOne({ where: { reference } });
    }
    data.reference = reference;
  }
  const reservation = await Reservation.create(data);
  res.status(201).json(reservation);
};

exports.update = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  await reservation.update(sanitizeReservation(req.body));
  res.json(reservation);
};

exports.confirmer = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  await reservation.update({ statut: 'confirmé', ...sanitizeReservation(req.body) });
  res.json(reservation);
};

exports.terminer = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  await reservation.update({ statut: 'terminé' });
  res.json(reservation);
};

exports.annuler = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  await reservation.update({ statut: 'annulé' });
  res.json(reservation);
};

exports.convert = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    if (reservation.source !== 'public') return res.status(400).json({ message: 'Seules les réservations publiques peuvent être converties' });

    const { client_id, mecanicien_id, create_client, create_vehicle } = req.body;

    let client;
    if (client_id) {
      client = await Client.findByPk(client_id);
      if (!client) return res.status(404).json({ message: 'Client non trouvé' });
    } else if (create_client) {
      client = await Client.create({
        nom: reservation.client_nom,
        prenom: reservation.client_prenom,
        telephone: reservation.client_telephone,
        email: reservation.client_email || '',
      });
    } else {
      return res.status(400).json({ message: 'Sélectionnez un client existant ou créez-en un' });
    }

    let vehicle = null;
    if (create_vehicle !== false && reservation.vehicule_immatriculation) {
      const existing = await Vehicle.findOne({ where: { immatriculation: reservation.vehicule_immatriculation } });
      if (!existing) {
        vehicle = await Vehicle.create({
          marque: reservation.vehicule_marque || '',
          modele: reservation.vehicule_modele || '',
          annee: reservation.vehicule_annee || null,
          immatriculation: reservation.vehicule_immatriculation || '',
          client_id: client.id,
          description_panne: reservation.description_probleme || '',
          statut: 'en_attente',
        });
      } else {
        vehicle = existing;
      }
    }

    const updateData = { statut: 'confirmé', client_id: client.id, receptionniste_id: req.user.id };
    if (mecanicien_id) updateData.mecanicien_id = parseInt(mecanicien_id);
    if (vehicle) updateData.vehicule_id = vehicle.id;

    await reservation.update(updateData);

    const result = await Reservation.findByPk(reservation.id, {
      include: [
        { model: Client, as: 'client' },
        { model: Vehicle, as: 'vehicle' },
        { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
      ],
    });

    res.json({ message: 'Réservation convertie avec succès', reservation: result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la conversion', error: error.message });
  }
};

exports.destroy = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  await reservation.destroy();
  res.json({ message: 'Réservation supprimée' });
};
