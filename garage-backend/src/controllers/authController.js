const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    if (!user.actif) {
      return res.status(403).json({ message: 'Compte désactivé' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.me = async (req, res) => {
  res.json(req.user);
};

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, telephone } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    const user = await User.create({ nom, prenom, email, password, role, telephone });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
