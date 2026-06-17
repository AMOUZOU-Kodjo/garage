const { Client, Vehicle, Reservation } = require('../models');

exports.index = async (req, res) => {
  const clients = await Client.findAll({
    include: [{ model: Vehicle, as: 'vehicules' }],
    order: [['createdAt', 'DESC']],
  });
  res.json(clients);
};

exports.show = async (req, res) => {
  const client = await Client.findByPk(req.params.id, {
    include: [
      { model: Vehicle, as: 'vehicules', include: [{ model: require('../models/Repair'), as: 'reparation' }] },
      { model: Reservation, as: 'reservations' },
    ],
  });
  if (!client) return res.status(404).json({ message: 'Client non trouvé' });
  res.json(client);
};

exports.store = async (req, res) => {
  const client = await Client.create(req.body);
  res.status(201).json(client);
};

exports.update = async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client non trouvé' });
  await client.update(req.body);
  res.json(client);
};

exports.destroy = async (req, res) => {
  const client = await Client.findByPk(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client non trouvé' });
  await client.destroy();
  res.json({ message: 'Client supprimé' });
};
