const { Reservation, Client, User, Repair } = require('../models');

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

exports.destroy = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
  await reservation.destroy();
  res.json({ message: 'Réservation supprimée' });
};
