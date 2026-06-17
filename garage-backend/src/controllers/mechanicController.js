const { User } = require('../models');

exports.index = async (req, res) => {
  const mecaniciens = await User.findAll({
    where: { role: 'mecanicien' },
    attributes: { exclude: ['password'] },
    order: [['nom', 'ASC']],
  });
  res.json(mecaniciens);
};

exports.store = async (req, res) => {
  const data = { ...req.body, role: 'mecanicien' };
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });
  const mecanicien = await User.create(data);
  res.status(201).json(mecanicien.toJSON());
};

exports.update = async (req, res) => {
  const mecanicien = await User.findByPk(req.params.id);
  if (!mecanicien) return res.status(404).json({ message: 'Mécanicien non trouvé' });
  if (req.body.password) {
    const bcrypt = require('bcryptjs');
    req.body.password = await bcrypt.hash(req.body.password, 10);
  } else {
    delete req.body.password;
  }
  await mecanicien.update(req.body);
  res.json(mecanicien.toJSON());
};

exports.destroy = async (req, res) => {
  const mecanicien = await User.findByPk(req.params.id);
  if (!mecanicien) return res.status(404).json({ message: 'Mécanicien non trouvé' });
  await mecanicien.destroy();
  res.json({ message: 'Mécanicien supprimé' });
};

exports.toggleActif = async (req, res) => {
  const mecanicien = await User.findByPk(req.params.id);
  if (!mecanicien) return res.status(404).json({ message: 'Mécanicien non trouvé' });
  await mecanicien.update({ actif: !mecanicien.actif });
  res.json(mecanicien.toJSON());
};
