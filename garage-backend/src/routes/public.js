const router = require('express').Router();
const publicCtrl = require('../controllers/publicController');
const testimonialCtrl = require('../controllers/testimonialController');

router.post('/reservations', publicCtrl.create);
router.get('/reservations/:reference', publicCtrl.show);
router.get('/reservations/:reference/receipt', publicCtrl.receipt);
router.get('/testimonials', testimonialCtrl.publicIndex);

module.exports = router;
