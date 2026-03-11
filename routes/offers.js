const express = require('express');
const router = express.Router();
const offers = require('../controllers/offers');
const wrapAsync = require('../utils/wrapAsync');
const { validateOffer } = require('../middleware');
const upload = require('../utils/multerConfig');

router.route('/')
    .get(wrapAsync(offers.index))
    .post(upload.single('image'), validateOffer, wrapAsync(offers.createOffer));

router.get('/new', offers.renderNewForm);

router.get('/:id', wrapAsync(offers.showOffer));

module.exports = router;

module.exports = router;
