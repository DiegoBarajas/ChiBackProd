const {Router} = require('express');
const router = Router();

const historial = require('../controller/historial.controller');

router.route('/')
    .get(historial.getAll);

router.route('/support')
    .get(historial.getWhoNeedsSupport)


router.route('/support/:id')
    .put(historial.offSupport)

router.route('/:id')
    .put(historial.changeAutoMessages)
    .delete(historial.clearMessages)


module.exports = router;