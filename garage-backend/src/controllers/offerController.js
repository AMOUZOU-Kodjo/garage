const { Offer } = require('../models');

const sanitizeOffer = (body) => ({
  ...body,
  remise: body.remise === '' || body.remise == null ? null : parseFloat(body.remise),
});

exports.index = async (req, res) => {
  const offers = await Offer.findAll({ order: [['createdAt', 'DESC']] });
  res.json(offers);
};

exports.store = async (req, res) => {
  const offer = await Offer.create(sanitizeOffer(req.body));
  res.status(201).json(offer);
};

exports.update = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });
  await offer.update(sanitizeOffer(req.body));
  res.json(offer);
};

exports.destroy = async (req, res) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offre non trouvée' });
  await offer.destroy();
  res.json({ message: 'Offre supprimée' });
};
