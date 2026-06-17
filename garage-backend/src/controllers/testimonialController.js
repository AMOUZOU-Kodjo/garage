const { Testimonial } = require('../models');

exports.publicIndex = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { actif: true },
      order: [['createdAt', 'DESC']],
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.index = async (req, res) => {
  const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
  res.json(testimonials);
};

exports.store = async (req, res) => {
  try {
    const { nom, prenom, vehicule, texte, note } = req.body;
    if (!nom || !texte) return res.status(400).json({ message: 'Nom et texte requis' });
    const testimonial = await Testimonial.create({ nom, prenom, vehicule, texte, note: note || 5 });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const t = await Testimonial.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Témoignage non trouvé' });
    await t.update(req.body);
    res.json(t);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const t = await Testimonial.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Témoignage non trouvé' });
    await t.destroy();
    res.json({ message: 'Témoignage supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.toggleActif = async (req, res) => {
  try {
    const t = await Testimonial.findByPk(req.params.id);
    if (!t) return res.status(404).json({ message: 'Témoignage non trouvé' });
    await t.update({ actif: !t.actif });
    res.json(t);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
