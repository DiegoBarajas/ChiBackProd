const { Router } = require('express');
const router = Router();

const controller = require('../controller/whatsapp.controller');

router.route('/')
    .get(controller.get)


module.exports = router;