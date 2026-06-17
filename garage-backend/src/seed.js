require('dotenv').config();
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');
const { User, Client, Vehicle, Reservation, Repair, Offer } = require('./models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });

    const password = await bcrypt.hash('password123', 10);
    const [directeur] = await User.bulkCreate([
      { nom: 'Dupont', prenom: 'Pierre', email: 'directeur@garage.com', password, role: 'directeur', telephone: '0101010101' },
    ], { returning: true });
    const [mecanicien1, mecanicien2] = await User.bulkCreate([
      { nom: 'Martin', prenom: 'Jean', email: 'mecanicien1@garage.com', password, role: 'mecanicien', telephone: '0202020202', specialite: 'Moteur' },
      { nom: 'Petit', prenom: 'Luc', email: 'mecanicien2@garage.com', password, role: 'mecanicien', telephone: '0303030303', specialite: 'Carrosserie' },
    ], { returning: true });
    const [receptionniste] = await User.bulkCreate([
      { nom: 'Durand', prenom: 'Sophie', email: 'receptionniste@garage.com', password, role: 'receptionniste', telephone: '0404040404' },
    ], { returning: true });

    const [client1, client2, client3] = await Client.bulkCreate([
      { nom: 'Lemoine', prenom: 'Paul', email: 'paul@email.com', telephone: '0505050505', adresse: '12 rue de Paris' },
      { nom: 'Moreau', prenom: 'Marie', email: 'marie@email.com', telephone: '0606060606', adresse: '8 avenue de Lyon' },
      { nom: 'Bernard', prenom: 'Alex', email: 'alex@email.com', telephone: '0707070707', adresse: '15 boulevard Haussmann' },
    ], { returning: true });

    const [vehicle1, vehicle2, vehicle3] = await Vehicle.bulkCreate([
      { marque: 'Renault', modele: 'Clio', annee: 2020, immatriculation: 'AB-123-CD', kilometrage: 45000, statut: 'en_attente', description_panne: 'Bruit moteur anormal', client_id: client1.id },
      { marque: 'Peugeot', modele: '308', annee: 2021, immatriculation: 'EF-456-GH', kilometrage: 30000, statut: 'en_cours', description_panne: 'Fuite d\'huile', client_id: client2.id, mecanicien_id: mecanicien1.id },
      { marque: 'Citroen', modele: 'C3', annee: 2019, immatriculation: 'IJ-789-KL', kilometrage: 60000, statut: 'reparé', description_panne: 'Plaquettes de frein usées', client_id: client3.id, mecanicien_id: mecanicien2.id },
    ], { returning: true });

    const [reservation1, reservation2] = await Reservation.bulkCreate([
      { date_reservation: new Date().toISOString().split('T')[0], heure_reservation: '09:00', description_probleme: 'Vidange et révision', statut: 'confirmé', client_id: client1.id, mecanicien_id: mecanicien1.id, receptionniste_id: receptionniste.id },
      { date_reservation: new Date().toISOString().split('T')[0], heure_reservation: '14:00', description_probleme: 'Changement pneus', statut: 'en_attente', client_id: client2.id },
    ], { returning: true });

    await Repair.bulkCreate([
      { panne_constatee: 'Fuite d\'huile au niveau du joint de culasse', solution_appliquee: 'Remplacement du joint', outils_utilises: 'Clé dynamométrique, douilles', duree_intervention: 180, cout_main_oeuvre: 250.00, montant_pieces: 85.50, montant_total: 335.50, vehicule_id: vehicle2.id, mecanicien_id: mecanicien1.id },
      { panne_constatee: 'Plaquettes de frein usées', solution_appliquee: 'Remplacement plaquettes avant et arrière', outils_utilises: 'Cric, clé, pince', duree_intervention: 120, cout_main_oeuvre: 150.00, montant_pieces: 120.00, montant_total: 270.00, vehicule_id: vehicle3.id, mecanicien_id: mecanicien2.id },
    ], { returning: true });

    await Offer.bulkCreate([
      { titre: 'Promo Vidange', description: 'Vidange complète à -20%', remise: 20.00, date_debut: '2026-06-01', date_fin: '2026-07-31', actif: true },
    ]);

    console.log('Seed completed successfully!');
    console.log('Connexions:');
    console.log('  Directeur:    directeur@garage.com / password123');
    console.log('  Réceptionniste: receptionniste@garage.com / password123');
    console.log('  Mécanicien 1: mecanicien1@garage.com / password123');
    console.log('  Mécanicien 2: mecanicien2@garage.com / password123');
  } catch (error) {
    console.error('Seed error:', error);
  }
};

seed();
