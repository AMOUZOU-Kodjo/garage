const { Reservation } = require('../models');

const generateReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'RES-';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
};

exports.create = async (req, res) => {
  try {
    const { date_reservation, heure_reservation, description_probleme,
      client_nom, client_prenom, client_telephone, client_email,
      vehicule_marque, vehicule_modele, vehicule_annee, vehicule_immatriculation } = req.body;

    if (!date_reservation || !heure_reservation || !client_nom || !client_prenom || !client_telephone) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    let reference;
    let exists = true;
    while (exists) {
      reference = generateReference();
      exists = await Reservation.findOne({ where: { reference } });
    }

    const reservation = await Reservation.create({
      reference,
      date_reservation,
      heure_reservation,
      description_probleme: description_probleme || '',
      source: 'public',
      client_nom,
      client_prenom,
      client_telephone,
      client_email: client_email || '',
      vehicule_marque: vehicule_marque || '',
      vehicule_modele: vehicule_modele || '',
      vehicule_annee: vehicule_annee || null,
      vehicule_immatriculation: vehicule_immatriculation || '',
    });

    res.status(201).json({
      message: 'Réservation envoyée avec succès',
      reference: reservation.reference,
      statut: reservation.statut,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réservation', error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ where: { reference: req.params.reference } });
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });

    res.json({
      reference: reservation.reference,
      statut: reservation.statut,
      date_reservation: reservation.date_reservation,
      heure_reservation: reservation.heure_reservation,
      description_probleme: reservation.description_probleme,
      client_nom: reservation.client_nom,
      client_prenom: reservation.client_prenom,
      client_telephone: reservation.client_telephone,
      client_email: reservation.client_email,
      vehicule_marque: reservation.vehicule_marque,
      vehicule_modele: reservation.vehicule_modele,
      vehicule_annee: reservation.vehicule_annee,
      vehicule_immatriculation: reservation.vehicule_immatriculation,
      createdAt: reservation.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

exports.receipt = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ where: { reference: req.params.reference } });
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    if (reservation.statut !== 'confirmé') {
      return res.status(400).json({ message: 'La réservation doit être confirmée avant d\'obtenir un reçu' });
    }

    const receipt = {
      reference: reservation.reference,
      societe: 'GarageAuto',
      date_reservation: reservation.date_reservation,
      heure_reservation: reservation.heure_reservation,
      description_probleme: reservation.description_probleme,
      client: `${reservation.client_prenom} ${reservation.client_nom}`,
      client_telephone: reservation.client_telephone,
      client_email: reservation.client_email,
      vehicule: `${reservation.vehicule_marque} ${reservation.vehicule_modele}`.trim(),
      vehicule_annee: reservation.vehicule_annee,
      immatriculation: reservation.vehicule_immatriculation,
      statut: reservation.statut,
      created_at: reservation.createdAt,
    };

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};


