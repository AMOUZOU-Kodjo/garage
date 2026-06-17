const router = require('express').Router();
const publicCtrl = require('../controllers/publicController');

router.post('/reservations', publicCtrl.create);
router.get('/reservations/:reference', publicCtrl.show);
router.get('/reservations/:reference/receipt', publicCtrl.receipt);

module.exports = router;
