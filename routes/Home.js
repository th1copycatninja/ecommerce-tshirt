const express = require('express');
const router = express.Router()

const {home,dummyHome} = require('../controllers/HomeControllers');

router.get('/',home);
router.get('/dummy',dummyHome);

module.exports = router;