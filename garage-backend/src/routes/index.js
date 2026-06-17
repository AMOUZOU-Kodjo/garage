const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const authCtrl = require('../controllers/authController');
const clientCtrl = require('../controllers/clientController');
const vehicleCtrl = require('../controllers/vehicleController');
const reservationCtrl = require('../controllers/reservationController');
const repairCtrl = require('../controllers/repairController');
const mechanicCtrl = require('../controllers/mechanicController');
const offerCtrl = require('../controllers/offerController');
const dashboardCtrl = require('../controllers/dashboardController');
const receiptCtrl = require('../controllers/receiptController');
const financeCtrl = require('../controllers/financeController');

// Auth
router.post('/auth/login', authCtrl.login);
router.post('/auth/register', authCtrl.register);
router.get('/auth/me', auth, authCtrl.me);

// Clients
router.get('/clients', auth, clientCtrl.index);
router.get('/clients/:id', auth, clientCtrl.show);
router.post('/clients', auth, clientCtrl.store);
router.put('/clients/:id', auth, clientCtrl.update);
router.delete('/clients/:id', auth, role('directeur'), clientCtrl.destroy);

// Vehicles
router.get('/vehicles', auth, vehicleCtrl.index);
router.get('/vehicles/:id', auth, vehicleCtrl.show);
router.post('/vehicles', auth, vehicleCtrl.store);
router.put('/vehicles/:id', auth, vehicleCtrl.update);
router.put('/vehicles/:id/assign', auth, role('receptionniste', 'directeur'), vehicleCtrl.assign);
router.put('/vehicles/:id/liberer', auth, role('receptionniste', 'directeur'), vehicleCtrl.liberer);
router.delete('/vehicles/:id', auth, role('directeur'), vehicleCtrl.destroy);

// Reservations
router.get('/reservations', auth, reservationCtrl.index);
router.get('/reservations/:id', auth, reservationCtrl.show);
router.post('/reservations', auth, reservationCtrl.store);
router.put('/reservations/:id', auth, reservationCtrl.update);
router.put('/reservations/:id/confirmer', auth, role('receptionniste', 'directeur'), reservationCtrl.confirmer);
router.put('/reservations/:id/terminer', auth, role('mecanicien', 'receptionniste', 'directeur'), reservationCtrl.terminer);
router.put('/reservations/:id/annuler', auth, role('receptionniste', 'directeur'), reservationCtrl.annuler);
router.delete('/reservations/:id', auth, role('directeur'), reservationCtrl.destroy);

// Repairs
router.get('/repairs', auth, repairCtrl.index);
router.get('/repairs/:id', auth, repairCtrl.show);
router.post('/repairs', auth, role('mecanicien'), repairCtrl.store);
router.put('/repairs/:id', auth, role('mecanicien'), repairCtrl.update);
router.put('/repairs/:id/marquer-repare', auth, role('mecanicien'), repairCtrl.marquerRepare);

// Mechanics
router.get('/mechanics', auth, role('directeur', 'receptionniste'), mechanicCtrl.index);
router.post('/mechanics', auth, role('directeur'), mechanicCtrl.store);
router.put('/mechanics/:id', auth, role('directeur'), mechanicCtrl.update);
router.delete('/mechanics/:id', auth, role('directeur'), mechanicCtrl.destroy);
router.put('/mechanics/:id/toggle-actif', auth, role('directeur'), mechanicCtrl.toggleActif);

// Offers
router.get('/offers', auth, offerCtrl.index);
router.post('/offers', auth, role('receptionniste', 'directeur'), offerCtrl.store);
router.put('/offers/:id', auth, role('receptionniste', 'directeur'), offerCtrl.update);
router.delete('/offers/:id', auth, role('directeur'), offerCtrl.destroy);

// Dashboards
router.get('/dashboard/receptionniste', auth, role('receptionniste', 'directeur'), dashboardCtrl.receptionniste);
router.get('/dashboard/mecanicien', auth, role('mecanicien', 'directeur'), dashboardCtrl.mecanicien);
router.get('/dashboard/directeur', auth, role('directeur'), dashboardCtrl.directeur);

// Receipt
router.get('/vehicles/:id/receipt', auth, role('receptionniste', 'directeur'), receiptCtrl.generate);

// Finances (Director)
router.get('/finances/summary', auth, role('directeur'), financeCtrl.summary);

module.exports = router;
