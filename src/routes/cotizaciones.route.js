const {Router} = require('express');
const router = Router();

const controller = require('../controller/cotizaciones.controller');

router.route('/')
    .get(controller.getAll)
    

module.exports = router;