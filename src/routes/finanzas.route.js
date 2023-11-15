const { Router } = require('express');
const router = Router();

const controller = require('../controller/finanzas.controller');

router.route('/')
    .get(controller.getAll)
    .post(controller.create)

module.exports = router;