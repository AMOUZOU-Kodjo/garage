const { Vehicle, Client, User, Repair } = require('../models');

exports.generate = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: User, as: 'mecanicien', attributes: ['id', 'nom', 'prenom'] },
        { model: Repair, as: 'reparation' },
      ],
    });
    if (!vehicle) return res.status(404).json({ message: 'Véhicule non trouvé' });

    const directeur = await User.findOne({ where: { role: 'directeur', actif: true }, attributes: ['nom', 'prenom'] });

    const reparation = vehicle.reparation || {};
    const cout = parseFloat(reparation.cout_main_oeuvre) || 0;
    const pieces = parseFloat(reparation.montant_pieces) || 0;

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '-';

    const receipt = {
      numero: `REC-${vehicle.id}-${Date.now()}`,
      date_entree: vehicle.date_entree,
      date_sortie: vehicle.date_sortie || new Date(),
      societe: 'GarageAuto',
      directeur: directeur ? `${directeur.prenom} ${directeur.nom}` : 'Directeur',
      client: vehicle.client ? `${vehicle.client.prenom} ${vehicle.client.nom}` : 'N/A',
      client_tel: vehicle.client?.telephone || '',
      marque: vehicle.marque,
      modele: vehicle.modele,
      immatriculation: vehicle.immatriculation,
      probleme: vehicle.description_panne || reparation.panne_constatee || 'N/A',
      mecanicien: vehicle.mecanicien ? `${vehicle.mecanicien.prenom} ${vehicle.mecanicien.nom}` : 'N/A',
      main_oeuvre: cout,
      pieces: pieces,
      total: reparation.montant_total ? parseFloat(reparation.montant_total) : (cout + pieces),
      solution: reparation.solution_appliquee || '',
    };

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};
