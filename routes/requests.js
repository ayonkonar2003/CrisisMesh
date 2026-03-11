const express = require('express');
const router = express.Router();
const requests = require('../controllers/requests');
const wrapAsync = require('../utils/wrapAsync');
const { validateRequest } = require('../middleware');
const upload = require('../utils/multerConfig');

router.route('/')
    .get(wrapAsync(requests.index))
    .post(upload.single('image'), validateRequest, wrapAsync(requests.createRequest));

router.get('/new', requests.renderNewForm);

router.route('/:id')
    .get(wrapAsync(requests.showRequest));

router.put('/:id/verify', wrapAsync(requests.verifyRequest));
router.put('/:id/resolve', wrapAsync(requests.resolveRequest));

module.exports = router;

module.exports = router;
